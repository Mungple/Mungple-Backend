package com.e106.mungplace.web.marker.producer;

import java.util.List;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.e106.mungplace.domain.marker.entity.MarkerEvent;
import com.e106.mungplace.domain.marker.entity.PublishStatus;
import com.e106.mungplace.domain.marker.repository.MarkerOutboxRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Component
public class MarkerProducer {

	private static final String KAFKA_TOPIC = "marker";
	private static final String KAFKA_KEY = "marker";

	private final KafkaTemplate<String, MarkerEvent> kafkaTemplate;
	private final MarkerOutboxRepository markerOutboxRepository;

	@Transactional
	@Scheduled(fixedDelayString = "${outbox.polling.interval:5000}")
	public void pollOutbox() {
		// READY 상태인 MarkerOutbox 목록을 비관적 잠금으로 가져옴
		List<MarkerEvent> pendingOutboxes = markerOutboxRepository.findByStatusWithLock(PublishStatus.READY);

		if (pendingOutboxes.isEmpty()) {
			return;
		}

		// 각 Outbox를 처리
		for (MarkerEvent outbox : pendingOutboxes) {
			processOutbox(outbox);
		}
	}

	// Outbox 레코드 처리 로직 분리
	private void processOutbox(MarkerEvent outbox) {
		try {
			sendEvent(outbox); // Marker 객체를 Kafka로 전송
			markAsDone(outbox); // 상태를 DONE으로 업데이트
		} catch (Exception e) {
			log.error("아웃박스 처리 실패: {}", outbox.getEntityId(), e);
		}
	}

	// Marker 객체를 Kafka로 전송
	public void sendEvent(MarkerEvent outboxEntry) {
		// Kafka로 Marker 객체 전송
		kafkaTemplate.send(KAFKA_TOPIC, KAFKA_KEY, outboxEntry).whenComplete((result, ex) -> {
			if (ex == null) {
				log.info("Kafka 메시지 발송 성공 - EntityId: {}", outboxEntry.getEntityId());
			} else {
				log.error("Kafka 메시지 발송 실패 - EntityId: {}", outboxEntry.getEntityId(), ex);
			}
		});
	}

	// Outbox의 상태를 DONE으로 업데이트하고 저장
	private void markAsDone(MarkerEvent outbox) {
		outbox.updateStatus(PublishStatus.DONE);
		markerOutboxRepository.save(outbox);
	}
}
