package com.e106.mungplace.domain.heatmap.impl;

import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import com.e106.mungplace.common.log.dto.LogAction;
import com.e106.mungplace.common.log.dto.LogLevel;
import com.e106.mungplace.common.log.impl.ApplicationLogger;
import com.e106.mungplace.domain.heatmap.dto.HeatmapChunk;
import com.e106.mungplace.domain.heatmap.event.HeatmapQueryType;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class HeatmapChunkPublisher {

	private static final int QUEUE_EXPIRE_TIME = 30;

	private final RedisTemplate<String, HeatmapChunk> redisTemplate;
	private final ApplicationLogger logger;

	public void publish(Long userId, HeatmapQueryType queryType, HeatmapChunk heatmapChunk) {
		String key = generateKey(userId, queryType);
		redisTemplate.opsForList().rightPush(key, heatmapChunk);
		redisTemplate.expire(key, QUEUE_EXPIRE_TIME, TimeUnit.SECONDS);

		logger.log(LogLevel.DEBUG, LogAction.PUBLISH,
			String.format("publish heatmapChunk userId: %s, key: %s, type: %s", userId.toString(), key,
				queryType.toString()), getClass());
	}

	private String generateKey(Long userId, HeatmapQueryType queryType) {
		return String.format("users:%s:%s", userId, queryType.getValue());
	}
}
