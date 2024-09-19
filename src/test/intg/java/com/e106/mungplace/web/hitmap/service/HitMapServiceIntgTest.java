package com.e106.mungplace.web.hitmap.service;

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
import org.springframework.data.geo.Point;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.test.context.ActiveProfiles;

import com.e106.mungplace.domain.hitmap.event.HitMapQueryEvent;
import com.e106.mungplace.domain.hitmap.event.HitMapQueryType;
import com.e106.mungplace.web.hitmap.dto.HitMapRequest;
import com.fasterxml.jackson.databind.ObjectMapper;

@ActiveProfiles("intg")
@SpringBootTest
public class HitMapServiceIntgTest {

	@Autowired
	private HitMapService hitMapService;

	@MockBean
	private KafkaTemplate<String, Object> kafkaTemplate;

	@Autowired
	private KafkaTemplate<String, HitMapQueryEvent> realKafkaTemplate;

	@Autowired
	private ObjectMapper objectMapper;

	private BlockingQueue<HitMapQueryEvent> records;

	@BeforeEach
	void setUp() {
		records = new LinkedBlockingQueue<>();
	}

	@KafkaListener(topics = "test", groupId = "#{T(java.util.UUID).randomUUID().toString()}")
	public void consume(HitMapQueryEvent event) {
		records.add(event);
	}

	@DisplayName("히트맵 조회 이벤트를 발행하면 구독하던 ")
	@Test
	void When_EmitHitMapQueryEvent_Then_CanConsumeEvent() throws InterruptedException {
		// given
		Long userId = 1L;
		HitMapRequest request = new HitMapRequest(new Point(38.39204, 123.343433), 100);
		// kafka Produce를 가로채 "test" 토픽으로 전송
		when(kafkaTemplate.send(any(), any())).then(invocationOnMock -> {
			return realKafkaTemplate.send("test", invocationOnMock.getArgument(1));
		});

		// when
		// Consumer가 생성될 때까지 대기
		Thread.sleep(3000);
		hitMapService.userBluezoneQueryProcess(userId, request);
		HitMapQueryEvent receivedEvent = records.poll(10, TimeUnit.SECONDS);

		// then
		assertThat(receivedEvent).isNotNull().isInstanceOf(HitMapQueryEvent.class);
		assertThat(receivedEvent.userId()).isEqualTo(userId);
		assertThat(receivedEvent.queryType()).isEqualTo(HitMapQueryType.USER_BLUEZONE);
	}
}