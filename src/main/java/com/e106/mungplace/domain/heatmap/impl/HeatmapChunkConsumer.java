package com.e106.mungplace.domain.heatmap.impl;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.e106.mungplace.common.log.dto.LogAction;
import com.e106.mungplace.common.log.dto.LogLevel;
import com.e106.mungplace.common.log.impl.ApplicationLogger;
import com.e106.mungplace.domain.heatmap.dto.HeatmapChunk;
import com.e106.mungplace.domain.heatmap.event.HeatmapQueryType;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class HeatmapChunkConsumer {

	private final ApplicationLogger logger;
	private final RedisTemplate<String, HeatmapChunk> redisTemplate;
	private final SimpMessagingTemplate messagingTemplate;

	public void consume(Long userId, HeatmapQueryType queryType) {
		String key = generateQueueKey(userId, queryType);
		String destination = generateDestination(queryType);

		HeatmapChunk chunk = redisTemplate.opsForList().leftPop(key);
		if (chunk != null) {
			logger.log(LogLevel.DEBUG, LogAction.CONSUME, String.format("key: %s, chunk: %s", key, chunk), getClass());
			messagingTemplate.convertAndSendToUser(userId.toString(), destination, chunk);
		}
		logger.log(LogLevel.DEBUG, LogAction.CONSUME, String.format("key: %s | 소켓 송신 종료", key), getClass());
	}

	private String generateQueueKey(Long userId, HeatmapQueryType queryType) {
		return String.format("users:%s:%s", userId, queryType.getValue());
	}

	private String generateDestination(HeatmapQueryType queryType) {
		return switch (queryType) {
			case USER_BLUEZONE -> "/sub/users/bluezone";
			case BLUEZONE -> "/sub/bluezone";
			case REDZONE -> "/sub/redzone";
		};
	}
}
