package com.e106.mungplace.web.exploration.dto;

import java.util.List;

import lombok.Builder;

@Builder
public record ExplorationsResponse(
	int year,
	int month,
	int totalExplorations,
	List<ExplorationResponse> explorationInfos
) {
	public static ExplorationsResponse of(int year, int month, List<ExplorationResponse> explorationInfos) {
		return ExplorationsResponse.builder()
			.year(year)
			.month(month)
			.totalExplorations(explorationInfos.size())
			.explorationInfos(explorationInfos)
			.build();
	}
}
