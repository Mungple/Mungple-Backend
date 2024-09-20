package com.e106.mungplace.web.exploration.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExplorationEventRequest {

    @NotNull
    private Long userId;

    @NotNull
    private String latitude;

    @NotNull
    private String longitude;

    @NotNull
    private LocalDateTime recordedAt;
}
