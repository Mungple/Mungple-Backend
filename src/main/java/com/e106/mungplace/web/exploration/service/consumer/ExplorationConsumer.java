package com.e106.mungplace.web.exploration.service.consumer;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

import com.e106.mungplace.common.log.MethodLoggable;
import com.e106.mungplace.domain.exploration.entity.ExplorationEvent;
import com.e106.mungplace.domain.exploration.entity.ExplorePoint;
import com.e106.mungplace.domain.exploration.repository.ExplorePointRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class ExplorationConsumer {

	private final ExplorePointRepository explorePointRepository;
	public final String topic;

	public ExplorationConsumer(NewTopic explorationTopic, ExplorePointRepository explorePointRepository) {
		this.topic = explorationTopic.name();
		this.explorePointRepository = explorePointRepository;
	}

	@KafkaListener(
		topics = {"#{__listener.topic}"},
		groupId = "#{__listener.topic}-create-group",
		concurrency = "3"
	)

	public void listen(ExplorationEvent receivedEvent, Acknowledgment ack) {
		ExplorePoint explorePoint = ExplorePoint.builder()
			.userId(receivedEvent.userId())
			.explorationId(receivedEvent.explorationId())
			.point(receivedEvent.payload().point())
			.recordedAt(receivedEvent.payload().recordedAt())
			.build();

		explorePointRepository.save(explorePoint);

		ack.acknowledge();

		log.info("[{}] Consume Success - ID : {} ", topic.toUpperCase(), receivedEvent.explorationId());
	}
}
