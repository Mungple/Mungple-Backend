package com.e106.mungplace.domain.exploration.entity;

import com.e106.mungplace.web.exploration.dto.ExplorationEventRequest;
import com.e106.mungplace.web.exploration.dto.ExplorationPayload;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ExplorationEvent (

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