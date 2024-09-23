package com.e106.mungplace.domain.heatmap.impl;

import static org.assertj.core.api.Assertions.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.test.context.ActiveProfiles;

import com.e106.mungplace.common.map.dto.Point;
import com.e106.mungplace.domain.heatmap.dto.HeatmapCell;
import com.e106.mungplace.domain.heatmap.dto.HeatmapChunk;
import com.e106.mungplace.domain.heatmap.event.HeatmapQueryType;

@ActiveProfiles("intg")
@SpringBootTest
class HeatmapChunkPublisherIntgTest {

	@Autowired
	private HeatmapChunkPublisher heatmapChunkPublisher;

	@Autowired
	private RedisTemplate<String, HeatmapChunk> redisTemplate;

	@DisplayName("HeatmapChunckPublisher에 발행하면 Redis List에 저장되고 만료시간이 30초로 주어진다.")
	@Test
	void When_PublishHeatmapChunk_Then_SaveRedisAndExpiredAt30() {
		// given
		Long userId = 999999998L;
		HeatmapQueryType queryType = HeatmapQueryType.USER_BLUEZONE;
		List<HeatmapCell> cells = Stream.generate(this::generateHeatmapCell).limit(2).toList();
		HeatmapChunk heatmapChunk = new HeatmapChunk(cells);

		// when
		heatmapChunkPublisher.publish(userId, queryType, heatmapChunk);

		String queueKey = String.format("users:%d:userbluezone", userId);
		Long expirationTime = redisTemplate.getExpire(queueKey, TimeUnit.SECONDS);
		HeatmapChunk retrievedChunk = redisTemplate.opsForList().leftPop(queueKey, 3, TimeUnit.SECONDS);

		// then
		assertThat(retrievedChunk).isNotNull().isEqualTo(heatmapChunk);
		assertThat(expirationTime).isPositive().isLessThanOrEqualTo(30);
	}

	private HeatmapCell generateHeatmapCell() {
		Random random = new Random();
		return new HeatmapCell(new Point(random.nextDouble(100), random.nextDouble(100)), random.nextLong(10000L));
	}
}