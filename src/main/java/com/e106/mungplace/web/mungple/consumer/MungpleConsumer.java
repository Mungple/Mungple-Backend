package com.e106.mungplace.web.mungple.consumer;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

import com.e106.mungplace.common.map.dto.Point;
import com.e106.mungplace.domain.exploration.entity.ExplorationEvent;
import com.e106.mungplace.domain.mungple.entity.MungpleEvent;
import com.e106.mungplace.domain.mungple.entity.MungpleEventType;
import com.e106.mungplace.domain.util.GeoUtils;
import com.e106.mungplace.web.mungple.producer.MungpleProducer;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class MungpleConsumer {

	private static final int MUNGPLE_THRESHOLD = 2;
	private static final String MUNGPLE = ":mungple";

	private final RedisTemplate<String, String> redisTemplate;
	public final String topic;
	private final MungpleProducer mungpleProducer;

	public MungpleConsumer(NewTopic explorationTopic, RedisTemplate<String, String> redisTemplate,
		MungpleProducer mungpleProducer) {
		this.topic = explorationTopic.name();
		this.redisTemplate = redisTemplate;
		this.mungpleProducer = mungpleProducer;
	}

	@KafkaListener(
		topics = {"#{__listener.topic}"},
		groupId = "#{__listener.topic}-geohash-group",
		concurrency = "3"
	)
	public void listen(ExplorationEvent receivedEvent, Acknowledgment ack) {
		String userId = receivedEvent.userId().toString();

		// 현재 GeoHash 계산
		String currentGeoHash = Point.toMungpleGeoHash(
			receivedEvent.payload().point().lat().toString(),
			receivedEvent.payload().point().lon().toString()
		);

		// Redis에서 사용자의 이전 GeoHash 값 가져오기
		String previousGeoHash = redisTemplate.opsForValue().get(getUserGeoHashKey(userId));

		if (previousGeoHash == null) {
			// 최초 진입 시 사용자 수 증가
			increaseGeoHashUserCount(currentGeoHash);
			setMungplace(null, currentGeoHash);  // 처음에는 이전 위치가 없으므로 null 처리

		} else if (!previousGeoHash.equals(currentGeoHash)) {
			// 이전 위치와 현재 위치가 다를 경우 처리
			decreaseGeoHashUserCount(previousGeoHash);
			increaseGeoHashUserCount(currentGeoHash);
			setMungplace(previousGeoHash, currentGeoHash);
		}

		redisTemplate.opsForValue().set(getUserGeoHashKey(userId), currentGeoHash, 10, TimeUnit.MINUTES);

		// 내 위치 기준 멍플 조회
		getMunplesByMyLocation(currentGeoHash);

		printAllGeoHashUserCounts();
		ack.acknowledge();
	}

	private void getMunplesByMyLocation(String currentGeoHash) {

		List<String> strings = getNearbyMungplesSpiral(currentGeoHash, 500);
		System.out.println("-----------------------------------------------");
		for (String str : strings) {
			System.out.println(str);
		}
		System.out.println("-----------------------------------------------");
	}

	public List<String> getNearbyMungplesSpiral(String currentGeoHash, int radiusInMeters) {
		List<String> nearbyMungples = new ArrayList<>();
		Set<String> visited = new HashSet<>();

		// 153m 기준으로 몇 개의 GeoHash를 커버해야 하는지 계산 (500m 반경에 해당하는 그리드 개수)
		int geoHashSideLength = 153; // GeoHash 레벨 7이 153m
		int numOfSteps = (int)Math.ceil(radiusInMeters / (double)geoHashSideLength);

		// 좌표 이동 방향: 오른쪽, 아래, 왼쪽, 위쪽 (시계방향)
		int[][] directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};

		// 초기 위치 설정
		int x = 0, y = 0, directionIndex = 0;
		boolean increaseSteps = false;
		int steps = 1;

		// 중심 위치 먼저 처리
		nearbyMungples.add(currentGeoHash);
		visited.add(currentGeoHash);

		// 달팽이 모양 탐색 시작
		while (steps <= numOfSteps) {
			for (int i = 0; i < steps; i++) {
				// 현재 위치 계산
				x += directions[directionIndex][0];
				y += directions[directionIndex][1];

				// 새 좌표에서의 GeoHash 구하기
				Point newPoint = new Point(userLocation.lat() + (x * 0.0015), userLocation.lon() + (y * 0.0015));
				String newGeoHash = Point.toMungpleGeoHash(newPoint.lat().toString(), newPoint.lon().toString());

				// 이미 방문한 GeoHash는 건너뜀
				if (!visited.contains(newGeoHash)) {
					visited.add(newGeoHash);
					// GeoHash에서 Mungple 탐색
					if (isMungpleCreated(newGeoHash)) {
						nearbyMungples.add(newGeoHash);
					}
				}
			}

			// 방향 전환
			directionIndex = (directionIndex + 1) % 4;

			// 두 번의 방향 전환마다 steps 증가
			if (increaseSteps) {
				steps++;
			}
			increaseSteps = !increaseSteps; // 방향 전환 시마다 step을 한번씩 증가하도록 토글
		}

		return nearbyMungples;
	}

	private void setMungplace(String previousGeoHash, String currentGeoHash) {
		removeMungpleIfNeeded(previousGeoHash);
		createMungpleIfNeeded(currentGeoHash);
	}

	private void createMungpleIfNeeded(String currentGeoHash) {
		String currentUserCountStr = redisTemplate.opsForValue().get(getGeoHashKey(currentGeoHash));

		if (currentUserCountStr == null) {
			return;
		}

		int currentUserCount = Integer.parseInt(currentUserCountStr);

		if (currentUserCount < MUNGPLE_THRESHOLD) {
			return;
		}

		if (isMungpleCreated(currentGeoHash)) {
			return;
		}

		markMungpleCreated(currentGeoHash);
		MungpleEvent event = new MungpleEvent("mungple", currentGeoHash, MungpleEventType.MUNGPLE_CREATED,
			LocalDateTime.now());
		mungpleProducer.sendMungpleEvent(event);

		saveMungpleLocationInRedis(currentGeoHash);
	}

	// 멍플을 키값으로 등록
	public void saveMungpleLocationInRedis(String currentGeoHash) {
		redisTemplate.opsForValue().set(currentGeoHash, MUNGPLE);
	}

	private void removeMungpleIfNeeded(String previousGeoHash) {
		if (previousGeoHash == null) {
			return;
		}

		String previousUserCountStr = redisTemplate.opsForValue().get(getGeoHashKey(previousGeoHash));

		if (previousUserCountStr == null) {
			return;
		}

		int previousUserCount = Integer.parseInt(previousUserCountStr);

		if (previousUserCount >= MUNGPLE_THRESHOLD) {
			return;
		}

		// 멍플이 생성된 상태라면 제거
		if (isMungpleCreated(previousGeoHash)) {
			removeMungple(previousGeoHash);
			log.info("Mungple removed for GeoHash: {}", previousGeoHash);
		}
	}

	private String getUserGeoHashKey(String userId) {
		return "users:" + userId + ":geoHash";
	}

	private String getGeoHashKey(String geoHash) {
		return "geohash:" + geoHash;
	}

	private void increaseGeoHashUserCount(String geoHash) {
		redisTemplate.opsForValue().increment(getGeoHashKey(geoHash), 1);
	}

	private void decreaseGeoHashUserCount(String geoHash) {
		redisTemplate.opsForValue().decrement(getGeoHashKey(geoHash), 1);
	}

	private boolean isMungpleCreated(String geoHash) {
		return redisTemplate.hasKey("mungple:" + geoHash);
	}

	private void markMungpleCreated(String geoHash) {
		redisTemplate.opsForValue().set("mungple:" + geoHash, "created");
	}

	private void removeMungple(String geoHash) {
		redisTemplate.delete("mungple:" + geoHash);
	}

	// 모든 GeoHash의 사용자 수를 출력하는 메서드
	public void printAllGeoHashUserCounts() {
		Set<String> geoHashKeys = redisTemplate.keys("geohash:*");
		if (geoHashKeys != null && !geoHashKeys.isEmpty()) {
			for (String geoHashKey : geoHashKeys) {
				String userCount = redisTemplate.opsForValue().get(geoHashKey);
				log.info("GeoHash: {}, User Count: {}", geoHashKey, userCount);
			}
		} else {
			log.info("No GeoHash data found in Redis.");
		}
	}
}
