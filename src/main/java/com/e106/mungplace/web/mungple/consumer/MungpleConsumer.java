package com.e106.mungplace.web.mungple.consumer;

import static com.e106.mungplace.web.exception.dto.ApplicationSocketError.*;

import java.time.LocalDateTime;
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
import com.e106.mungplace.web.exception.ApplicationSocketException;
import com.e106.mungplace.web.mungple.producer.MungpleProducer;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class MungpleConsumer {

	private static final int MUNGPLE_THRESHOLD = 2;

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

		String currentGeoHash = Point.toMungpleGeoHash(
			receivedEvent.payload().point().lat().toString(),
			receivedEvent.payload().point().lon().toString()
		);

		if (currentGeoHash == null) {
			throw new ApplicationSocketException(DONT_SEND_ANY_REQUEST);
		}

		String previousGeoHash = redisTemplate.opsForValue().get(getUserGeoHashKey(userId));

		if (previousGeoHash == null) {
			increaseGeoHashUserCount(currentGeoHash);
			setMungplace(null, currentGeoHash);
		} else if(previousGeoHash != null) {
			if (!previousGeoHash.equals(currentGeoHash)) {
				decreaseGeoHashUserCount(previousGeoHash);
				increaseGeoHashUserCount(currentGeoHash);
				setMungplace(previousGeoHash, currentGeoHash);
			}
		}

		redisTemplate.opsForValue().set(getUserGeoHashKey(userId), currentGeoHash, 10, TimeUnit.MINUTES);

		printAllGeoHashUserCounts();
		ack.acknowledge();
	}

	private void setMungplace(String previousGeoHash, String currentGeoHash) {
		removeMungpleIfNeeded(previousGeoHash);
		createMungpleIfNeeded(currentGeoHash);
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

	private void createMungpleIfNeeded(String currentGeoHash) {
		// 유저수 가지고 오기
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
	}

	private String getUserGeoHashKey(String userId) {
		return "users:" + userId + ":mungple:geohash";
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
