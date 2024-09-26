package com.e106.mungplace.web.marker.consumer;

import java.util.Optional;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.data.elasticsearch.core.geo.GeoPoint;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

import com.e106.mungplace.domain.marker.entity.MarkerEvent;
import com.e106.mungplace.domain.marker.entity.MarkerPoint;
import com.e106.mungplace.domain.marker.entity.MarkerType;
import com.e106.mungplace.domain.marker.repository.MarkerPointRepository;
import com.e106.mungplace.web.marker.dto.MarkerPayload;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class MarkerConsumer {

	public final String topic;

	private final MarkerPointRepository markerPointRepository;

	private final ObjectMapper objectMapper;

	public MarkerConsumer(NewTopic markerTopic, MarkerPointRepository markerPointRepository,
		ObjectMapper objectMapper) {
		this.topic = markerTopic.name();
		this.markerPointRepository = markerPointRepository;
		this.objectMapper = objectMapper;
	}

	@KafkaListener(topics = "#{__listener.topic}", groupId = "#{__listener.topic}-create-group")
	public void saveMarkerEventProcess(MarkerEvent event, Acknowledgment ack) {

		String markerPayloadString = event.getPayload();
		Optional<MarkerPayload> markerPayloadOptional = deserializeMarker(markerPayloadString);

		markerPayloadOptional.ifPresentOrElse(markerPayload -> {
			GeoPoint geoPoint = new GeoPoint(markerPayload.getLat(), markerPayload.getLon());

			MarkerPoint markerPoint = MarkerPoint.builder()
				.markerId(event.getEntityId())
				.userId(markerPayload.getUserId())
				.explorationId(markerPayload.getExplorationId() != null ? markerPayload.getExplorationId() : null)
				.point(geoPoint)
				.createdAt(event.getCreatedAt())
				.type(MarkerType.valueOf(markerPayload.getType()))
				.build();

			markerPointRepository.save(markerPoint);
			log.info("[{}] Consume Success - ID : {} ", topic.toUpperCase(), event.getUuid());
		}, () -> {
			// TODO: <홍성우> 예외 처리 상세화
			log.error("Marker 복원 실패: {}", markerPayloadOptional);
			throw new RuntimeException();
		});
		ack.acknowledge();
	}

	private Optional<MarkerPayload> deserializeMarker(String payload) {
		try {
			if (payload.startsWith("\"") && payload.endsWith("\"")) {
				payload = objectMapper.readValue(payload, String.class);
			}
			return Optional.of(objectMapper.readValue(payload, MarkerPayload.class));
		} catch (JsonProcessingException e) {
			log.error("JSON 문자열을 Marker 객체로 변환하는 중 오류 발생: {}", payload, e);
			return Optional.empty();
		}
	}
}