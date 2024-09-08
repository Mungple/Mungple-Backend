package com.e106.mungplace.web.event.service;

import com.e106.mungplace.domain.event.dto.Message;
import com.e106.mungplace.domain.event.dto.Payload;
import com.e106.mungplace.domain.event.dto.type.OperationType;
import com.e106.mungplace.domain.event.dto.type.TopicType;
import com.e106.mungplace.domain.event.entity.Event;
import com.e106.mungplace.domain.event.producer.TempMessageProducer;
import com.e106.mungplace.domain.event.repository.EventRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class EventService {

    private final TempMessageProducer producer;
    private final EventRepository messageEventRepository;

    @Transactional(propagation = Propagation.REQUIRED)
    public void publishEventProcess(Payload payload, TopicType topicType, OperationType operationType) {
        /* ============ outbox Event 테이블 저장 ============ */
        Event event = messageEventRepository.save(Event
                .builder()
                .topicType(topicType)
                .operationType(operationType)
                .entityId(payload.getId())
                .entityData(payload.getData())
                .isPublished(false)
                .timestamp(payload.getTimestamp())
                .build()
        );

        /* ============ Message Produce ============ */
        // TODO : Outbox Pattern 구현 시 produce 로직 분리
        try {
            producer.sendMessage(Message.toMessage(
                            event.getEventId(),
                            event.getTopicType(),
                            operationType,
                            payload
                    )
            );
        } catch (JsonProcessingException e) {
            throw new RuntimeException("메시지 발행 실패.", e);
        }
    }
}
