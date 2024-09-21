package com.e106.mungplace.web.heatmap.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.test.context.ActiveProfiles;

import com.e106.mungplace.common.map.dto.Point;
import com.e106.mungplace.domain.heatmap.event.HeatmapQueryEvent;
import com.e106.mungplace.domain.heatmap.event.HeatmapQueryType;
import com.e106.mungplace.web.heatmap.dto.HeatmapRequest;
import com.fasterxml.jackson.databind.ObjectMapper;

@ActiveProfiles("intg")
@SpringBootTest
public class HeatmapQueryListenerServiceIntgTest {

	@Autowired
	private HeatmapQueryListenerService heatmapQueryListenerService;

	@MockBean
	private KafkaTemplate<String, Object> kafkaTemplate;

	@Autowired
	private KafkaTemplate<String, HeatmapQueryEvent> realKafkaTemplate;

	@Autowired
	private ObjectMapper objectMapper;

	private BlockingQueue<HeatmapQueryEvent> records;

	@BeforeEach
	void setUp() {
		records = new LinkedBlockingQueue<>();
	}

	@KafkaListener(topics = "heatmap-query-test", groupId = "#{T(java.util.UUID).randomUUID().toString()}")
	public void consume(HeatmapQueryEvent event) {
		records.add(event);
	}

	@DisplayName("히트맵 조회 이벤트를 발행하면 구독하던 ")
	@Test
	void When_EmitHitMapQueryEvent_Then_CanConsumeEvent() throws InterruptedException {
		// given
		Long userId = 1L;
		HeatmapRequest request = new HeatmapRequest(new Point(38.39204, 123.343433), 100);
		// kafka Produce를 가로채 "heatmap-query-test" 토픽으로 전송
		when(kafkaTemplate.send(any(), any())).then(invocationOnMock -> {
			return realKafkaTemplate.send("heatmap-query-test", invocationOnMock.getArgument(1));
		});

		// when
		// Consumer가 생성될 때까지 대기
		Thread.sleep(5000);
		heatmapQueryListenerService.userBluezoneQueryProcess(userId, request);
		HeatmapQueryEvent receivedEvent = records.poll(10, TimeUnit.SECONDS);

		// then
		assertThat(receivedEvent).isNotNull().isInstanceOf(HeatmapQueryEvent.class);
		assertThat(receivedEvent.userId()).isEqualTo(userId);
		assertThat(receivedEvent.queryType()).isEqualTo(HeatmapQueryType.USER_BLUEZONE);
	}
}