package com.e106.mungplace.web.exploration.dto;

import lombok.Builder;

import java.time.LocalDateTime;


@Builder
public record ExplorationPoint (
        LocalDateTime timestamp,
        double latitude,
        double longitude
) {
    public static ExplorationPoint of() {
        return ExplorationPoint.builder()
                // TODO : <이현수> elastic Search 조회 매핑
                .build();
    }
}

