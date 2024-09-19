package com.e106.mungplace.domain.exploration.entity;

import com.e106.mungplace.web.exploration.dto.ExplorationEventRequest;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ExplorationEvent (

        String entityType,
        Long userId,
        Long explorationId,
        String payload,
        LocalDateTime publishedAt
) {
    public static ExplorationEvent of(ExplorationEventRequest request, Long id, String payload) {
        return ExplorationEvent.builder()
                .entityType("Exploration")
                .userId(request.getUserId())
                .explorationId(id)
                .payload(payload)
                .publishedAt(LocalDateTime.now())
                .build();
    }
}