package com.e106.mungplace.domain.event.producer;

import com.e106.mungplace.domain.event.dto.Message;
import com.e106.mungplace.domain.event.util.CustomObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class TempMessageProducer {

    private final CustomObjectMapper objectMapper;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public void sendMessage(Message message) throws JsonProcessingException {
        kafkaTemplate.send(
                message.getTopicType().getType(),
                message.getTopicType().getType(), // TODO : 순서보장을 위한 키 값 지정 후 수정, 임시로 토픽을 키 값으로 설정
                objectMapper.writeValueAsString(message)
        );
    }
}
