package com.e106.mungplace.web.exploration;


import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

import com.e106.mungplace.domain.exploration.entity.ExplorationEvent;
import com.e106.mungplace.web.exploration.dto.ExplorationEventRequest;
import com.e106.mungplace.web.exploration.service.ExplorationService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.test.context.ActiveProfiles;

import com.fasterxml.jackson.databind.ObjectMapper;

@ActiveProfiles("intg")
@SpringBootTest
public class ExplorationServiceIntgTest {

    @Autowired
    private ExplorationService explorationService;

    @MockBean
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Autowired
    private KafkaTemplate<String, ExplorationEvent> realKafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    private BlockingQueue<ExplorationEvent> records;

    @BeforeEach
    void setUp() {
        records = new LinkedBlockingQueue<>();
    }

    @KafkaListener(topics = "exploration-test", groupId = "#{T(java.util.UUID).randomUUID().toString()}")
    public void consume(ExplorationEvent event) {
        records.add(event);
    }

    @DisplayName("산책 이벤트는 사용자의 Request 기반으로 만들어지고 produce, consume 된다.")
    @Test
    void When_EmitHitMapQueryEvent_Then_CanConsumeEvent() throws InterruptedException, JsonProcessingException {
        // given
        Long userId = 1L;
        Long explorationId = 1L;

        ExplorationEventRequest request = ExplorationEventRequest.builder()
                .userId(1L)
                .latitude("32.153321")
                .longitude("32.153321")
                .recordedAt(LocalDateTime.now())
                .build();

        // kafka Produce 를 가로채 "test" 토픽으로 전송
        when(kafkaTemplate.send(any(String.class), any(String.class), any(ExplorationEvent.class))).then(invocationOnMock ->
            realKafkaTemplate.send("exploration-test", invocationOnMock.getArgument(1), invocationOnMock.getArgument(2))
        );

        // when
        // Consumer가 생성될 때까지 대기
        Thread.sleep(5000);
        explorationService.createExplorationEventProcess(request, explorationId);
        ExplorationEvent receivedEvent = records.poll(10, TimeUnit.SECONDS);

        // then
        assertThat(receivedEvent).isNotNull().isInstanceOf(ExplorationEvent.class);
        assertThat(receivedEvent.userId()).isEqualTo(userId);
        assertThat(receivedEvent.explorationId()).isEqualTo(explorationId);
        assertThat(receivedEvent.entityType()).isEqualTo("Exploration");
        assertThat(receivedEvent.publishedAt()).isNotNull();
    }
}
