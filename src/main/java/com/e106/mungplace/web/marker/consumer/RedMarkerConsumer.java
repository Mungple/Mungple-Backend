package com.e106.mungplace.web.marker.consumer;

import java.time.LocalDateTime;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

import com.e106.mungplace.common.map.dto.Point;
import com.e106.mungplace.domain.heatmap.dto.RedzonePoint;
import com.e106.mungplace.domain.heatmap.repository.RedzonePointRepository;
import com.e106.mungplace.domain.marker.entity.MarkerEvent;
import com.e106.mungplace.domain.marker.entity.MarkerType;
import com.e106.mungplace.domain.marker.entity.OperationType;
import com.e106.mungplace.domain.marker.impl.MarkerSerializer;
import com.e106.mungplace.web.marker.dto.MarkerPayload;

@Component
public class RedMarkerConsumer {

	public final String topic;

	private final MarkerSerializer markerSerializer;
	private final RedzonePointRepository redzonePointRepository;

	public RedMarkerConsumer(NewTopic markerTopic, MarkerSerializer markerSerializer,
		RedzonePointRepository redzonePointRepository) {
		this.topic = markerTopic.name();
		this.markerSerializer = markerSerializer;
		this.redzonePointRepository = redzonePointRepository;
	}

	@KafkaListener(topics = "#{__listener.topic}", groupId = "#{__listener.topic}-redzone-group")
	public void saveRedzone(MarkerEvent event, Acknowledgment ack) {
		if (event.getOperationType() == OperationType.CREATE) {
			markerSerializer.deserializeMarker(event.getPayload())
				.filter(payload -> payload.getType() == MarkerType.RED)
				.map(this::mapToRedzonePoint)
				.ifPresent(redzonePointRepository::save);
		}
		ack.acknowledge();
	}

	private RedzonePoint mapToRedzonePoint(MarkerPayload payload) {
		return new RedzonePoint(new Point(payload.getLat(), payload.getLon()), LocalDateTime.now());
	}
}
