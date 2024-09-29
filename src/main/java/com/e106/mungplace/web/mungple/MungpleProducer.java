package com.e106.mungplace.web.mungple;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Component
public class MungpleProducer {

	private final NewTopic mungpleTopic;
	private final KafkaTemplate<String, Object> kafkaTemplate;

	public void sendMungpleEvent(MungpleEvent event) {
		kafkaTemplate.send(mungpleTopic.name(), event.entityType(), event);
	}
}