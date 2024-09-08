package com.e106.mungplace.domain.event.consumer;

import com.e106.mungplace.domain.event.dto.Message;
import com.e106.mungplace.domain.event.dto.type.TopicType;
import com.e106.mungplace.domain.event.util.CustomObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


/* TODO : 추후 consumer package 분리 */
@Slf4j
@RequiredArgsConstructor
@Component
public class TempMessageConsumer {

    private final CustomObjectMapper objectMapper;
    /* TODO : 아래 HashMap => Redis 를 통한 Message consume 멱등성 보장 */
    private final Map<String, Integer> idHistoryMap = new ConcurrentHashMap<>();

    @KafkaListener(
            topics = { "temp" },
            groupId = "temp-consumer-group",
            concurrency = "1"
    )

    public void accept(ConsumerRecord<String, String> m, Acknowledgment ack) throws JsonProcessingException {
        Message message = objectMapper.readValue(m.value(), Message.class);
        printPayloadIfFirstMessage(message);
        ack.acknowledge();
    }

    private void printPayloadIfFirstMessage(Message message) {
        if (idHistoryMap.putIfAbsent(String.valueOf(message.getId()), 1) == null) {
            log.info("[TEST CONSUMER] Message arrived! - {}", message.getPayload().getData());
        } else {
            /* TODO : 이미 처리가 완료 된 메시지, consume retry 불필요. 추후 retry 불필요 예외 지정 후 수정 */
            throw new RuntimeException("중복되는 메시지입니다.");
        }
    }
}
