package com.e106.mungplace.web.exploration.service.producer;

import com.e106.mungplace.domain.exploration.entity.ExplorationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@RequiredArgsConstructor
@Component
public class ExplorationProducer {

    private final NewTopic explorationTopic;
    private final KafkaTemplate<String, Object> template;

    public void sendExplorationEvent(ExplorationEvent event) {
        template.send(explorationTopic.name(), event.explorationId().toString(), event);
    }
}
