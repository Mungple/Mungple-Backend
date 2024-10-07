package com.e106.mungplace.web.mungple.consumer;

import static com.e106.mungplace.web.exception.dto.ApplicationSocketError.*;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
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

	@Value("${mungple.creation-threshold}")
	private int MUNGPLE_THRESHOLD;

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
			addUserToGeoHashSet(currentGeoHash, userId);
			setMungplace(null, currentGeoHash);  // 처음에는 이전 위치가 없으므로 null 처리
		} else if (previousGeoHash != null) {
			if (!previousGeoHash.equals(currentGeoHash)) {
				removeUserFromGeoHashSet(previousGeoHash, userId);
				addUserToGeoHashSet(currentGeoHash, userId);
				setMungplace(previousGeoHash, currentGeoHash);
			}
		}

		redisTemplate.opsForValue().set(getUserGeoHashKey(userId), currentGeoHash, 10, TimeUnit.MINUTES);

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

		Set<String> previousGeoHashUsers = redisTemplate.opsForSet().members(getGeoHashKey(previousGeoHash));

		if (previousGeoHashUsers == null || previousGeoHashUsers.size() >= MUNGPLE_THRESHOLD) {
			return;
		}

		if (isMungpleCreated(previousGeoHash)) {
			removeMungple(previousGeoHash);
			log.info("Mungple removed for GeoHash: {}", previousGeoHash);
		}
	}

	private void createMungpleIfNeeded(String currentGeoHash) {
		Set<String> currentGeoHashUsers = redisTemplate.opsForSet().members(getGeoHashKey(currentGeoHash));

		if (currentGeoHashUsers == null || currentGeoHashUsers.size() < MUNGPLE_THRESHOLD) {
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

	private void addUserToGeoHashSet(String geoHash, String userId) {
		redisTemplate.opsForSet().add(getGeoHashKey(geoHash), userId);
	}

	private void removeUserFromGeoHashSet(String geoHash, String userId) {
		redisTemplate.opsForSet().remove(getGeoHashKey(geoHash), userId);
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
				Long userCount = redisTemplate.opsForSet().size(geoHashKey);
				log.info("GeoHash: {}, User Count: {}", geoHashKey, userCount);
			}
		} else {
			log.info("No GeoHash data found in Redis.");
		}
	}
}
