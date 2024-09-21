package com.e106.mungplace.web.exploration.dto;

import lombok.Builder;

import java.time.LocalDateTime;

import com.e106.mungplace.common.map.dto.Point;

@Builder
public record ExplorationPayload (
    Point point,
    LocalDateTime recordedAt
) {
    public static ExplorationPayload of(Point point, LocalDateTime createdAt) {
        return ExplorationPayload.builder()
                .point(point)
                .recordedAt(createdAt)
                .build();
    }
}
