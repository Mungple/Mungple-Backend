package com.e106.mungplace.web.exploration.dto;

import lombok.Builder;

@Builder
public record ExplorationPoint(

	// LocalDateTime recordedAt,
	double lat,
	double lon
) {
	public static ExplorationPoint of(double lat, double lon) {
		return ExplorationPoint.builder()
			// .recordedAt(recordedAt)
			.lat(lat)
			.lon(lon)
			.build();
	}
}

