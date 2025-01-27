package com.e106.mungplace.domain.exploration.impl;

import static com.e106.mungplace.web.exception.dto.ApplicationSocketError.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
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
import com.e106.mungplace.web.handler.interceptor.WebSocketSessionManager;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Component
public class ExplorationRecorder {

	@Value("${mungple.creation-threshold}")
	private int MUNGPLE_THRESHOLD;

	private final ObjectMapper objectMapper;
	private final ExplorationRepository explorationRepository;
	private final RedisTemplate<String, String> redisTemplate;
	private final WebSocketSessionManager sessionManager;
	private final SimpMessagingTemplate messagingTemplate;

	private static final int MAX_DISTANCE_CAPACITY = 3;
	private final DogExplorationRepository dogExplorationRepository;
	private final ExplorationReader explorationReader;

	public void initRecord(String explorationId, String userId, String lat, String lon) {
		String userCurrentGeoHash = Point.toUserCurrentGeoHash(lat, lon);
		String constantGeoHash = Point.toConstantGeoHash(lat, lon);

		deleteAllValue(userId);

		redisTemplate.opsForValue().set(getUserGeoHashKey(userId), userCurrentGeoHash, 60, TimeUnit.SECONDS);
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

		String[] userLatLon = redisTemplate.opsForValue().get(getPrePointKey(userId)).split(",");
		String lat = userLatLon[0];
		String lon = userLatLon[1];

		decreaseGeoHashUserCount(Point.toMungpleGeoHash(lat, lon), userId);
		deleteAllValue(userId);
	}

	public void recordExploration(String userId, String lat, String lon) {
		String previousGeoHash = getValidatedUserGeoHash(userId);
		String currentGeoHash = Point.toUserCurrentGeoHash(lat, lon);
		redisTemplate.opsForValue().set(getUserGeoHashKey(userId), currentGeoHash, 60, TimeUnit.SECONDS);

		validateUserIdWhenGeoHashIsDifference(userId, previousGeoHash, currentGeoHash);

		String totalDistance = GeoUtils.secondDecimalFormat(calculateDistance(userId, lat, lon));
		redisTemplate.opsForValue().set(getTotalDistanceKey(userId), totalDistance);

		sendDistanceToUser(userId, totalDistance);
		log.info("Service 산책 거리 저장 완료");
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

		double calculateNineSecondsDistance = getCalculateNineSecondsDistance(userId);
		if (calculateNineSecondsDistance >= 90.00) {
			throw new ApplicationSocketException(TOO_FAST_EXPLORING);
		}

		redisTemplate.opsForValue().set(getPrePointKey(userId), lat + "," + lon);

		return String.valueOf(amountDistance);
	}

	private void sendDistanceToUser(String userId, String totalDistance) {
		Map<String, String> distanceMap = new HashMap<>();
		distanceMap.put("distance", totalDistance);

		try {
			String distanceJson = objectMapper.writeValueAsString(distanceMap);
			messagingTemplate.convertAndSendToUser(userId, "/sub/explorations/distance", distanceJson);
		} catch (JsonProcessingException e) {
			log.error("JSON 변환 오류: {}", e.getMessage());
		}
	}
	
	@Scheduled(fixedRate = 20000)
	public void validateActiveUsers() {
		Set<String> activeUserInfos = redisTemplate.opsForSet().members(getActiveUsersKey());

		if (activeUserInfos == null || activeUserInfos.isEmpty()) {
			return;
		}

		activeUserInfos.forEach((activeUserInfo) -> {
			String userId = activeUserInfo.split(":")[0];
			String explorationId = activeUserInfo.split(":")[1];

			if(redisTemplate.opsForValue().get(getUserGeoHashKey(userId)) != null) return;

			Exploration exploration = explorationReader.get(Long.parseLong(explorationId));

			if(!exploration.isEnded()) {
				endRecord(userId, explorationId);
			} else {
				redisTemplate.opsForSet().remove(getActiveUsersKey(), userId + ":" + explorationId);
			}
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
		String geoHash = redisTemplate.opsForValue().get(getUserGeoHashKey(userId));
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

	private String getUserGeoHashKey(String userId) {
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

	private String getUserMungpleKey(String userId) {
		return "users:" + userId + ":mungple:geohash";
	}

	private String getGeoHashUserCountKey(String geoHash) {
		return "geohash:" + geoHash;
	}

	private String getMungpleKey(String geoHash) {
		return "mungple:" + geoHash;
	}

	private void decreaseGeoHashUserCount(String geoHash, String userId) {
		redisTemplate.opsForSet().remove(getGeoHashUserCountKey(geoHash), userId);

		Long userCount = redisTemplate.opsForSet().size(getGeoHashUserCountKey(geoHash));
		if (userCount == null || userCount < MUNGPLE_THRESHOLD) {
			redisTemplate.delete(getMungpleKey(geoHash));
		}
	}

	private void deleteAllValue(String userId) {
		redisTemplate.delete(getUserGeoHashKey(userId));
		redisTemplate.delete(getConstantKey(userId));
		redisTemplate.delete(getThreePointDistanceKey(userId));
		redisTemplate.delete(getPrePointKey(userId));
		redisTemplate.delete(getUserMungpleKey(userId));
	}
}
