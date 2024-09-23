package com.e106.mungplace.domain.heatmap.impl;

import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import com.e106.mungplace.domain.heatmap.dto.HeatmapChunk;
import com.e106.mungplace.domain.heatmap.event.HeatmapQueryType;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
@Component
public class HeatmapChunkConsumer {

	private static final int QUEUE_WAIT_TIME = 30;

	private final RedisTemplate<String, HeatmapChunk> redisTemplate;
	private final SimpMessagingTemplate messagingTemplate;

	@Async("taskExecutor")
	public void consume(Long userId, HeatmapQueryType queryType) {
		String key = generateQueueKey(userId, queryType);
		String destination = generateDestination(userId, queryType);

		long endTime = System.currentTimeMillis() + QUEUE_WAIT_TIME * 1000;

		while (System.currentTimeMillis() < endTime) {
			HeatmapChunk chunk = redisTemplate.opsForList().leftPop(key, 500, TimeUnit.MILLISECONDS);
			if (chunk != null) {
				log.info("key: {}, chunk: {}", key, chunk);
				messagingTemplate.convertAndSend(destination, chunk);
			}
		}
		log.info("key: {} | 소켓 송신 종료", key);
	}

	private String generateQueueKey(Long userId, HeatmapQueryType queryType) {
		return String.format("users:%s:%s", userId, queryType.getValue());
	}

	private String generateDestination(Long userId, HeatmapQueryType queryType) {
		return switch (queryType) {
			case USER_BLUEZONE -> String.format("/users/%s/bluezone", userId);
			case BLUEZONE -> "/users/bluezone";
			case REDZONE -> "/users/redzone";
		};
	}
}
