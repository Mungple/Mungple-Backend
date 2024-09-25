package com.e106.mungplace.domain.heatmap.impl;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.test.context.ActiveProfiles;

import com.e106.mungplace.common.map.dto.Point;
import com.e106.mungplace.domain.heatmap.dto.HeatmapCell;
import com.e106.mungplace.domain.heatmap.dto.HeatmapChunk;
import com.e106.mungplace.domain.heatmap.event.HeatmapQueryType;

@ActiveProfiles("intg")
@SpringBootTest
class HeatmapChunkConsumerIntgTest {

	@Autowired
	private HeatmapChunkConsumer heatmapChunkConsumer;

	@Autowired
	private RedisTemplate<String, HeatmapChunk> redisTemplate;

	@Autowired
	private ThreadPoolTaskExecutor taskExecutor;

	@MockBean
	private SimpMessagingTemplate messagingTemplate;

	@DisplayName("Redis Queue에 HeatmapChunk가 있으면 Consumer가 소켓으로 전달한다.")
	@Test
	void When_QueueHasHeatmapChunk_Then_ConsumerSendToSocket() throws InterruptedException {
		// given
		Long userId = 999999999L;
		HeatmapQueryType queryType = HeatmapQueryType.USER_BLUEZONE;
		String queueKey = String.format("users:%d:userbluezone", userId);
		List<HeatmapCell> cells = Stream.generate(this::generateHeatmapCell).limit(2).toList();
		redisTemplate.opsForList().rightPush(queueKey, new HeatmapChunk(cells));

		// when
		heatmapChunkConsumer.consume(userId, queryType);
		Thread.sleep(1000);

		// then
		HeatmapChunk resultChunk = redisTemplate.opsForList().leftPop(queueKey, 1, TimeUnit.SECONDS);
		assertThat(resultChunk).isNull();

		ArgumentCaptor<HeatmapChunk> captor = ArgumentCaptor.forClass(HeatmapChunk.class);
		verify(messagingTemplate, times(1)).convertAndSendToUser(any(), any(), captor.capture());
		HeatmapChunk sentChunk = captor.getValue();

		assertThat(sentChunk).isNotNull();
		assertThat(sentChunk.cells()).containsAll(cells);

		// teardown
		taskExecutor.shutdown();
	}

	private HeatmapCell generateHeatmapCell() {
		Random random = new Random();
		return new HeatmapCell(new Point(random.nextDouble(100), random.nextDouble(100)), random.nextLong(10000L));
	}
}