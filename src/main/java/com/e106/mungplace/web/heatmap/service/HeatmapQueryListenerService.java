package com.e106.mungplace.web.heatmap.service;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.e106.mungplace.domain.heatmap.event.HeatmapQueryEvent;
import com.e106.mungplace.domain.heatmap.event.HeatmapQueryType;
import com.e106.mungplace.web.heatmap.dto.HeatmapRequest;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class HeatmapQueryListenerService {

	private final ObjectMapper objectMapper;
	private final KafkaTemplate<String, Object> kafkaTemplate;
	private final NewTopic heatMapTopic;

	public void userBluezoneQueryProcess(Long userId, HeatmapRequest request) {
		emitHitMapQueryEvent(request.toEvent(userId, HeatmapQueryType.USER_BLUEZONE));
	}

	public void bluezoneQueryProcess(Long userId, HeatmapRequest request) {
		emitHitMapQueryEvent(request.toEvent(userId, HeatmapQueryType.BLUEZONE));
	}

	public void redzoneQueryProcess(Long userId, HeatmapRequest request) {
		emitHitMapQueryEvent(request.toEvent(userId, HeatmapQueryType.REDZONE));
	}

	private void emitHitMapQueryEvent(HeatmapQueryEvent event) {
		kafkaTemplate.send(heatMapTopic.name(), event).whenComplete((result, throwable) -> {
			if (throwable == null) {
				log.debug("HitMap Event 발행: {}", result.getProducerRecord().value().toString());
			} else {
				log.error("HitMap Event 실패: {}", throwable.getMessage(), throwable);
			}
		});
	}
}
