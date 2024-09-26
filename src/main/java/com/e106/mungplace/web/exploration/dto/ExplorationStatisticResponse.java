package com.e106.mungplace.web.exploration.dto;

import lombok.Builder;

@Builder
public record ExplorationStatisticResponse(
	int year,
	int month,
	int totalExplorations,
	Long totalTime,
	Long totalDistance,
	int bestDistanceDay,
	Long bestDistance,
	int bestTimeDay,
	Long bestTime

) {
	public static ExplorationStatisticResponse of(
		int year,
		int month,
		int totalExplorations,
		Long totalTime,
		Long totalDistance,
		int bestDistanceDay,
		Long bestDistance,
		int bestTimeDay,
		Long bestTime
	) {
		return ExplorationStatisticResponse.builder()
			.year(year)
			.month(month)
			.totalExplorations(totalExplorations)
			.totalTime(totalTime)
			.totalDistance(totalDistance)
			.bestDistanceDay(bestDistanceDay)
			.bestDistance(bestDistance)
			.bestTimeDay(bestTimeDay)
			.bestTime(bestTime)
			.build();
	}
}
