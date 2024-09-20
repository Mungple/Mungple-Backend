package com.e106.mungplace.web.exploration.dto;

import lombok.Builder;
import org.springframework.data.elasticsearch.core.geo.GeoPoint;

import java.time.LocalDateTime;

@Builder
public record ExplorationPayload (
    GeoPoint geoPoint,
    LocalDateTime recordedAt
) {
    public static ExplorationPayload of(GeoPoint geoPoint, LocalDateTime createdAt) {
        return ExplorationPayload.builder()
                .geoPoint(geoPoint)
                .recordedAt(createdAt)
                .build();
    }
}
