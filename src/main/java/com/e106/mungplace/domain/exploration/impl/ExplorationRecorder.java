package com.e106.mungplace.domain.exploration.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import com.e106.mungplace.common.map.dto.Point;
import com.e106.mungplace.domain.util.GeoUtils;
import com.e106.mungplace.web.exception.ApplicationSocketException;
import com.e106.mungplace.web.exception.dto.ApplicationSocketError;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Component
public class ExplorationRecorder {

	private final RedisTemplate<String, String> redisTemplate;

	private static final int GEOHASH_INDEX = 0;
	private static final int DISTANCE_INDEX = 1;
	private static final int MAX_DISTANCE_CAPACITY = 3;

	public void initRecord(String userId, String latitude, String longitude) {
		String userCurrentGeoHash = Point.toUserCurrentGeoHash(latitude, longitude);
		String constantGeoHash = Point.toConstantGeoHash(latitude, longitude);

		redisTemplate.delete(getUserKey(userId));
		redisTemplate.delete(getDistanceKey(userId));
		redisTemplate.delete(getPrePointKey(userId));

		redisTemplate.opsForValue().set(getPrePointKey(userId), latitude + "," + longitude);
		redisTemplate.opsForValue().set(getConstantKey(userId), constantGeoHash, 30, TimeUnit.MINUTES);
		redisTemplate.opsForSet().add(getActiveUserKey(), userId);

		redisTemplate.opsForList()
			.rightPushAll(getUserKey(userId), userCurrentGeoHash, "0", userCurrentGeoHash.substring(0, 7));
		redisTemplate.expire(getUserKey(userId), 60, TimeUnit.SECONDS);
	}

	public void recordCurrentUserGeoHash(String userId, String latitude, String longitude) {
		List<String> userRecord = redisTemplate.opsForList().range(getUserKey(userId), 0, -1);
		if (userRecord == null || userRecord.isEmpty() || userRecord.get(GEOHASH_INDEX) == null) {
			throw new ApplicationSocketException(ApplicationSocketError.DONT_SEND_ANY_REQUEST);
		}

		String userPreviousGeoHash = userRecord.get(GEOHASH_INDEX);
		String userCurrentGeoHash = Point.toUserCurrentGeoHash(latitude, longitude);

		redisTemplate.opsForList().set(getUserKey(userId), GEOHASH_INDEX, userCurrentGeoHash);
		validateUserIdWhenGeoHashIsDifference(userId, userPreviousGeoHash, userCurrentGeoHash);
		calculateAndRecordDistance(userId, latitude, longitude);

		redisTemplate.expire(getUserKey(userId), 60, TimeUnit.SECONDS);
	}

	public Long endRecord(String userId) {
		List<String> userRecord = redisTemplate.opsForList().range(getUserKey(userId), 0, -1);

		if (userRecord == null)
			return 0L;

		Long explorationTotalDistance = getExplorationTotalDistance(userRecord);

		redisTemplate.delete(getUserKey(userId));
		redisTemplate.delete(getDistanceKey(userId));
		redisTemplate.delete(getPrePointKey(userId));
		redisTemplate.opsForSet().remove(getActiveUserKey(), userId);

		return explorationTotalDistance;
	}

	private void calculateAndRecordDistance(String userId, String latitude, String longitude) {
		String[] previousLatLon = redisTemplate.opsForValue().get(getPrePointKey(userId)).split(",");

		Point previousPoint = new Point(Double.parseDouble(previousLatLon[0]), Double.parseDouble(previousLatLon[1]));
		Point currentPoint = new Point(Double.parseDouble(latitude), Double.parseDouble(longitude));

		String amountDistanceString = redisTemplate.opsForList().index(getUserKey(userId), DISTANCE_INDEX);

		double distance = GeoUtils.calculateDistance(previousPoint, currentPoint);
		double amountDistance = Double.parseDouble(amountDistanceString) + distance;

		if (redisTemplate.opsForList().size(getDistanceKey(userId)) >= MAX_DISTANCE_CAPACITY) {
			redisTemplate.opsForList().leftPop(getDistanceKey(userId));
		}
		redisTemplate.opsForList().rightPush(getDistanceKey(userId), String.valueOf(distance));
		redisTemplate.opsForValue().set(getPrePointKey(userId), latitude + "," + longitude);

		if (getDistance(userId) >= 90.00) {
			throw new ApplicationSocketException(ApplicationSocketError.TOO_FAST_EXPLORING);
		}

		redisTemplate.opsForList().set(getUserKey(userId), DISTANCE_INDEX, String.valueOf(amountDistance));
	}

	private void validateUserIdWhenGeoHashIsDifference(String userId, String userPreviousGeoHash,
		String userCurrentGeoHash) {
		if (!Objects.equals(userPreviousGeoHash, userCurrentGeoHash)) {
			return;
		}

		String previous = redisTemplate.opsForValue().get(getConstantKey(userId));
		String current = userCurrentGeoHash.substring(0, 8);

		if (previous == null) {
			throw new ApplicationSocketException(ApplicationSocketError.DONT_MOVE_ANY_PLACE);
		}

		if (!Objects.equals(previous, current)) {
			redisTemplate.opsForValue().set(getConstantKey(userId), current, 30, TimeUnit.MINUTES);
		}
	}

	public void validateActiveUsers(String currentUserId) {
		Set<String> activeUsers = redisTemplate.opsForSet().members(getActiveUserKey());
		if (!activeUsers.contains(currentUserId) || activeUsers == null || activeUsers.isEmpty())
			return;

		activeUsers.forEach(userId -> {
			if (Objects.equals(userId, currentUserId)
				&& redisTemplate.opsForList().index(getUserKey(userId), GEOHASH_INDEX) == null) {
				throw new ApplicationSocketException(ApplicationSocketError.DONT_SEND_ANY_REQUEST);
			}
		});
	}

	private double getDistance(String userId) {
		List<String> distances = redisTemplate.opsForList().range(getDistanceKey(userId), 0, -1);
		if (distances == null || distances.isEmpty()) {
			return 0.0;
		}

		return BigDecimal.valueOf(distances.stream()
				.mapToDouble(Double::parseDouble)
				.sum())
			.setScale(2, RoundingMode.HALF_UP)
			.doubleValue();
	}

	private Long getExplorationTotalDistance(List<String> userRecord) {
		String[] distance = userRecord.get(DISTANCE_INDEX).split("\\.");
		return Long.parseLong(distance[0]);
	}

	private String getActiveUserKey() {
		return "activeUsers";
	}

	private String getUserKey(String userId) {
		return "users:" + userId;
	}

	private String getConstantKey(String userId) {
		return "users:" + userId + ":constant";
	}

	private String getDistanceKey(String userId) {
		return "users:" + userId + ":distances";
	}

	private String getPrePointKey(String userId) {
		return "users:" + userId + ":prePoint";
	}
}
