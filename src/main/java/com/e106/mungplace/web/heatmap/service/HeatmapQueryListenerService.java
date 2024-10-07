package com.e106.mungplace.web.heatmap.service;

import java.time.LocalDateTime;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.e106.mungplace.common.log.MethodLoggable;
import com.e106.mungplace.common.log.dto.LogAction;
import com.e106.mungplace.domain.heatmap.event.HeatmapQueryEvent;
import com.e106.mungplace.domain.heatmap.event.HeatmapQueryType;
import com.e106.mungplace.domain.heatmap.impl.HeatmapChunkConsumer;
import com.e106.mungplace.web.exception.ApplicationSocketException;
import com.e106.mungplace.web.exception.dto.ApplicationSocketError;
import com.e106.mungplace.web.heatmap.dto.HeatmapRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class HeatmapQueryListenerService {

	private final KafkaTemplate<String, Object> kafkaTemplate;
	private final HeatmapChunkConsumer heatmapChunkConsumer;
	private final NewTopic heatMapTopic;

	@MethodLoggable(action = LogAction.SELECT)
	public void userBluezoneQueryProcess(Long userId, HeatmapRequest request) {
		LocalDateTime to = LocalDateTime.now();
		LocalDateTime from = to.minusMonths(1);
		emitHitMapQueryEvent(request.toEvent(userId, HeatmapQueryType.USER_BLUEZONE, from, to));
		heatmapChunkConsumer.consume(userId, HeatmapQueryType.USER_BLUEZONE);
	}

	@MethodLoggable(action = LogAction.SELECT)
	public void bluezoneQueryProcess(Long userId, HeatmapRequest request) {
		LocalDateTime to = LocalDateTime.now();
		LocalDateTime from = to.minusMonths(6);
		emitHitMapQueryEvent(request.toEvent(userId, HeatmapQueryType.BLUEZONE, from, to));
		heatmapChunkConsumer.consume(userId, HeatmapQueryType.BLUEZONE);
	}

	@MethodLoggable(action = LogAction.SELECT)
	public void redzoneQueryProcess(Long userId, HeatmapRequest request) {
		LocalDateTime to = LocalDateTime.now();
		LocalDateTime from = to.minusMonths(6);
		emitHitMapQueryEvent(request.toEvent(userId, HeatmapQueryType.REDZONE, from, to));
		heatmapChunkConsumer.consume(userId, HeatmapQueryType.REDZONE);
	}

	private void emitHitMapQueryEvent(HeatmapQueryEvent event) {
		kafkaTemplate.send(heatMapTopic.name(), event).whenComplete((result, throwable) -> {
			if (throwable == null) {
				log.debug("HitMap Event 발행: {}", result.getProducerRecord().value().toString());
			} else {
				log.error("HitMap Event 실패: {}", throwable.getMessage(), throwable);
				throw new ApplicationSocketException(ApplicationSocketError.EVENT_REQUEST_NOT_SEND);
			}
		});
	}
}
