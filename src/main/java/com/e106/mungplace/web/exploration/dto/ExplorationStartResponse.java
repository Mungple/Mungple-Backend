package com.e106.mungplace.web.exploration.dto;

import java.time.LocalDateTime;

import com.e106.mungplace.domain.exploration.entity.Exploration;

import lombok.Builder;

@Builder
public record ExplorationStartResponse(
	Long explorationId,
	LocalDateTime startTime
) {

	public static ExplorationStartResponse of(Exploration exploration) {
		return ExplorationStartResponse.builder()
			.explorationId(exploration.getId())
			.startTime(exploration.getStartAt())
			.build();
	}
}
