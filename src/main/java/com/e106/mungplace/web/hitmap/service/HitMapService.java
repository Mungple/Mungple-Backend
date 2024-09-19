package com.e106.mungplace.web.hitmap.service;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.e106.mungplace.domain.hitmap.event.HitMapQueryEvent;
import com.e106.mungplace.domain.hitmap.event.HitMapQueryType;
import com.e106.mungplace.web.hitmap.dto.HitMapRequest;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class HitMapService {

	private final ObjectMapper objectMapper;
	private final KafkaTemplate<String, Object> kafkaTemplate;
	private final NewTopic hitMapTopic;

	public void userBluezoneQueryProcess(Long userId, HitMapRequest request) {
		emitHitMapQueryEvent(request.toEvent(userId, HitMapQueryType.USER_BLUEZONE));
	}

	public void bluezoneQueryProcess(Long userId, HitMapRequest request) {
		emitHitMapQueryEvent(request.toEvent(userId, HitMapQueryType.BLUEZONE));
	}

	public void redzoneQueryProcess(Long userId, HitMapRequest request) {
		emitHitMapQueryEvent(request.toEvent(userId, HitMapQueryType.REDZONE));
	}

	private void emitHitMapQueryEvent(HitMapQueryEvent event) {
		kafkaTemplate.send(hitMapTopic.name(), event).whenComplete((result, throwable) -> {
			if (throwable == null) {
				log.debug("HitMap Event 발행: {}", result.getProducerRecord().value().toString());
			} else {
				log.error("HitMap Event 실패: {}", throwable.getMessage(), throwable);
			}
		});
	}
}
