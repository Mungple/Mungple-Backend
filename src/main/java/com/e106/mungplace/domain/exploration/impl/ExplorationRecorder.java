package com.e106.mungplace.domain.exploration.impl;

import static com.e106.mungplace.web.exception.dto.ApplicationSocketError.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.e106.mungplace.common.map.dto.Point;
import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.exploration.repository.DogExplorationRepository;
import com.e106.mungplace.domain.exploration.repository.ExplorationRepository;
import com.e106.mungplace.domain.util.GeoUtils;
import com.e106.mungplace.web.exception.ApplicationSocketException;
import com.e106.mungplace.web.exception.dto.ErrorResponse;
import com.e106.mungplace.web.handler.interceptor.WebSocketSessionManager;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class ExplorationRecorder {

	private final ExplorationRepository explorationRepository;
	private final RedisTemplate<String, String> redisTemplate;
	private final WebSocketSessionManager sessionManager;
	private final SimpMessagingTemplate messagingTemplate;

	private static final int MAX_DISTANCE_CAPACITY = 3;
	private final DogExplorationRepository dogExplorationRepository;

	public void initRecord(String explorationId, String userId, String lat, String lon) {
		String userCurrentGeoHash = Point.toUserCurrentGeoHash(lat, lon);
		String constantGeoHash = Point.toConstantGeoHash(lat, lon);

		deleteAllValue(userId);

		redisTemplate.opsForValue().set(getUserKey(userId), userCurrentGeoHash, 60, TimeUnit.SECONDS);
		redisTemplate.opsForValue().set(getConstantKey(userId), constantGeoHash, 30, TimeUnit.MINUTES);
		redisTemplate.opsForValue().set(getTotalDistanceKey(userId), "0");
		redisTemplate.opsForValue().set(getPrePointKey(userId), lat + "," + lon);
		redisTemplate.opsForList().rightPush(getThreePointDistanceKey(userId), "0");
		redisTemplate.opsForSet().add(getActiveUsersKey(), userId + ":" + explorationId);
	}

	public void endRecord(String userId, String explorationId) {
		Long explorationTotalDistance = getExplorationTotalDistance(userId);
		Exploration exploration = explorationRepository.findById(Long.parseLong(explorationId))
			.orElseThrow(() -> new ApplicationSocketException(EXPLORATION_NOT_FOUND));

		if (exploration.isEnded()) {
			throw new ApplicationSocketException(IS_ENDED_EXPLORATION);
		}

		exploration.end(explorationTotalDistance);

		explorationRepository.save(exploration);
		dogExplorationRepository.findDogExplorationsByExplorationId(exploration.getId()).stream()
			.peek(dogExploration -> dogExploration.updateIsEnded(true))
			.forEach(dogExplorationRepository::save);

		redisTemplate.opsForSet().remove(getActiveUsersKey(), userId + ":" + explorationId);
		redisTemplate.opsForValue().setIfPresent(getTotalDistanceKey(userId), "0", 1, TimeUnit.MILLISECONDS);
		deleteAllValue(userId);
	}

	public void recordExploration(String userId, String lat, String lon) {
		String previousGeoHash = getValidatedUserGeoHash(userId);
		String currentGeoHash = Point.toUserCurrentGeoHash(lat, lon);
		redisTemplate.opsForValue().set(getUserKey(userId), currentGeoHash, 60, TimeUnit.SECONDS);

		validateUserIdWhenGeoHashIsDifference(userId, previousGeoHash, currentGeoHash);

		String totalDistance = calculateDistance(userId, lat, lon);
		redisTemplate.opsForValue().set(getTotalDistanceKey(userId), totalDistance);
	}

	private boolean validateUserIdWhenGeoHashIsDifference(String userId, String userPreviousGeoHash,
		String userCurrentGeoHash) {
		if (!Objects.equals(userPreviousGeoHash, userCurrentGeoHash)) {
			return false;
		}

		String previous = redisTemplate.opsForValue().get(getConstantKey(userId));
		String current = userCurrentGeoHash.substring(0, 8);

		if (previous == null) {
			throw new ApplicationSocketException(DONT_MOVE_ANY_PLACE);
		}

		if (!Objects.equals(previous, current)) {
			redisTemplate.opsForValue().set(getConstantKey(userId), current, 30, TimeUnit.MINUTES);
		}

		return true;
	}

	private String calculateDistance(String userId, String lat, String lon) {
		String[] previousLatLon = redisTemplate.opsForValue().get(getPrePointKey(userId)).split(",");
		String previousUserTotalDistance = redisTemplate.opsForValue().get(getTotalDistanceKey(userId));

		double distance = getDistanceBetweenPoints(lat, lon, previousLatLon);
		double amountDistance = Double.parseDouble(previousUserTotalDistance) + distance;

		if (redisTemplate.opsForList().size(getThreePointDistanceKey(userId)) >= MAX_DISTANCE_CAPACITY) {
			redisTemplate.opsForList().leftPop(getThreePointDistanceKey(userId));
		}
		redisTemplate.opsForList().rightPush(getThreePointDistanceKey(userId), String.valueOf(distance));
		redisTemplate.opsForValue().set(getPrePointKey(userId), lat + "," + lon);

		double calculateNineSecondsDistance = getCalculateNineSecondsDistance(userId);
		if (calculateNineSecondsDistance >= 90.00) {

			throw new ApplicationSocketException(TOO_FAST_EXPLORING);
		}

		return String.valueOf(amountDistance);
	}

	@Scheduled(fixedRate = 3000)
	public void validateActiveUsers() {
		Set<String> connectedUserIds = sessionManager.getConnectedUserIds();
		Set<String> activeUserInfos = redisTemplate.opsForSet().members(getActiveUsersKey());

		if (activeUserInfos == null || activeUserInfos.isEmpty()) {
			return;
		}

		ErrorResponse response = ErrorResponse.of(DONT_SEND_ANY_REQUEST);
		activeUserInfos.stream()
			.filter(activeUserInfo -> {
				String userId = activeUserInfo.split(":")[0]; // userId만 추출
				return !connectedUserIds.contains(userId); // 연결된 userId가 아닌 경우 필터링
			})
			.forEach(activeUserInfo -> {
				String[] info = activeUserInfo.split(":");
				String userId = info[0];
				String explorationId = info[1];

				messagingTemplate.convertAndSendToUser(userId, "/sub/errors", response);
				endRecord(userId, explorationId);
			});
	}

	private static double getDistanceBetweenPoints(String lat, String lon, String[] previousLatLon) {
		Point previousPoint = new Point(Double.parseDouble(previousLatLon[0]), Double.parseDouble(previousLatLon[1]));
		Point currentPoint = new Point(Double.parseDouble(lat), Double.parseDouble(lon));
		return GeoUtils.calculateDistance(previousPoint, currentPoint);
	}

	private double getCalculateNineSecondsDistance(String userId) {
		List<String> distances = redisTemplate.opsForList().range(getThreePointDistanceKey(userId), 0, -1);

		return BigDecimal.valueOf(distances.stream().mapToDouble(Double::parseDouble).sum())
			.setScale(2, RoundingMode.HALF_UP)
			.doubleValue();
	}

	private String getValidatedUserGeoHash(String userId) {
		String geoHash = redisTemplate.opsForValue().get(getUserKey(userId));
		if (geoHash == null) {
			throw new ApplicationSocketException(DONT_SEND_ANY_REQUEST);
		}
		return geoHash;
	}

	private Long getExplorationTotalDistance(String userId) {
		String recordedDistance = redisTemplate.opsForValue().get(getTotalDistanceKey(userId));
		if (recordedDistance == null)
			return 0L;

		String distance = recordedDistance.split("\\.")[0];
		return Long.parseLong(distance);
	}

	private String getActiveUsersKey() {
		return "active_users";
	}

	private String getUserKey(String userId) {
		return "users:" + userId + ":geohash";
	}

	private String getConstantKey(String userId) {
		return "users:" + userId + ":constant";
	}

	private String getTotalDistanceKey(String userId) {
		return "users:" + userId + ":total_distance";
	}

	private String getThreePointDistanceKey(String userId) {
		return "users:" + userId + ":point_distance";
	}

	private String getPrePointKey(String userId) {
		return "users:" + userId + ":pre_point";
	}

	private void deleteAllValue(String userId) {
		redisTemplate.delete(getUserKey(userId));
		redisTemplate.delete(getConstantKey(userId));
		redisTemplate.delete(getThreePointDistanceKey(userId));
		redisTemplate.delete(getPrePointKey(userId));
	}
}
