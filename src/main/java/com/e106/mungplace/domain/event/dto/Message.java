package com.e106.mungplace.domain.event.dto;

import com.e106.mungplace.domain.event.dto.type.OperationType;
import com.e106.mungplace.domain.event.dto.type.TopicType;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    private Long id;
    private TopicType topicType;
    private OperationType operationType;
    private Payload payload;

    public static Message toMessage(Long id, TopicType topicType, OperationType operationType, Payload payload) {
        if(operationType == OperationType.CREATE || operationType == OperationType.UPDATE) {
            payload = new Payload(
                    payload.getId(),
                    payload.getUserId(),
                    payload.getData(),
                    payload.getTimestamp()
            );
        }

        return Message.builder()
                .id(id)
                .topicType(topicType)
                .operationType(operationType)
                .payload(payload)
                .build();
    }
}