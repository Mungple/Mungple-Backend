package com.e106.mungplace.web.exploration.dto;

import java.time.LocalDateTime;

import lombok.Builder;

@Builder
public record ExplorationPoint(
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

