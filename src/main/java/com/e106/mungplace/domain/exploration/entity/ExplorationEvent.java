package com.e106.mungplace.domain.exploration.entity;

import java.time.LocalDateTime;

import com.e106.mungplace.web.exploration.dto.ExplorationEventRequest;
import com.e106.mungplace.web.exploration.dto.ExplorationPayload;

import lombok.Builder;

@Builder
public record ExplorationEvent(

	String entityType,
	Long userId,
	Long explorationId,
	ExplorationPayload payload,
	LocalDateTime publishedAt
) {
	public static ExplorationEvent of(ExplorationEventRequest request, Long id, ExplorationPayload payload) {
		return ExplorationEvent.builder()
			.entityType("Exploration")
			.userId(request.getUserId())
			.explorationId(id)
			.payload(payload)
			.publishedAt(LocalDateTime.now())
			.build();
	}
}