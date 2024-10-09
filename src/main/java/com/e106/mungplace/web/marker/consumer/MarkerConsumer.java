package com.e106.mungplace.web.marker.consumer;

import static com.e106.mungplace.web.exception.dto.ApplicationError.*;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.data.elasticsearch.core.geo.GeoPoint;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

import com.e106.mungplace.domain.marker.entity.MarkerEvent;
import com.e106.mungplace.domain.marker.entity.MarkerPoint;
import com.e106.mungplace.domain.marker.impl.MarkerSerializer;
import com.e106.mungplace.domain.marker.repository.MarkerPointRepository;
import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.marker.dto.MarkerPayload;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class MarkerConsumer {

	private static final String KAFKA_TOPIC = "markerSaveFailure";

	public final String topic;

	private final MarkerPointRepository markerPointRepository;

	private final MarkerSerializer markerSerializer;

	private final KafkaTemplate<String, String> kafkaTemplate;

	public MarkerConsumer(NewTopic markerTopic, MarkerPointRepository markerPointRepository, ObjectMapper objectMapper,
		MarkerSerializer markerSerializer, KafkaTemplate<String, String> kafkaTemplate) {
		this.topic = markerTopic.name();
		this.markerPointRepository = markerPointRepository;
		this.markerSerializer = markerSerializer;
		this.kafkaTemplate = kafkaTemplate;
	}

	@KafkaListener(topics = "#{__listener.topic}", groupId = "#{__listener.topic}-create-group", concurrency = "9")
	public void saveMarkerEventProcess(MarkerEvent event, Acknowledgment ack) {
		try {
			MarkerPayload markerPayload = markerSerializer.deserializeMarker(event.getPayload())
				.orElseThrow(() -> new ApplicationException(ELASTIC_SEARCH_SAVE_ERROR));

			MarkerPoint markerPoint = buildMarkerPoint(event, markerPayload);

			saveMarkerPoint(markerPoint, event);

			ack.acknowledge();
		} catch (Exception e) {
			kafkaTemplate.send(KAFKA_TOPIC, KAFKA_TOPIC, event.getEntityId().toString());
			throw new ApplicationException(ELASTIC_SEARCH_SAVE_ERROR);
		}
	}

	private MarkerPoint buildMarkerPoint(MarkerEvent event, MarkerPayload markerPayload) {
		GeoPoint geoPoint = new GeoPoint(markerPayload.getLat(), markerPayload.getLon());
		return MarkerPoint.builder()
			.markerId(event.getEntityId())
			.userId(markerPayload.getUserId())
			.explorationId(markerPayload.getExplorationId() != null ? markerPayload.getExplorationId() : null)
			.point(geoPoint)
			.createdAt(event.getCreatedAt())
			.type(markerPayload.getType())
			.build();
	}

	private void saveMarkerPoint(MarkerPoint markerPoint, MarkerEvent event) {
		markerPointRepository.save(markerPoint);
		log.info("[{}] Consume Success - ID : {}", topic.toUpperCase(), event.getUuid());
	}
}