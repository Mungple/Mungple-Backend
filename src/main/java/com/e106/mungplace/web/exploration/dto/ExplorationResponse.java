package com.e106.mungplace.web.exploration.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.e106.mungplace.domain.exploration.entity.Exploration;

import lombok.Builder;

@Builder
public record ExplorationResponse(
	Long explorationId,
	LocalDateTime startTime,
	LocalDateTime endTime,
	Long distance,
	List<Long> togetherDogIds,
	List<ExplorationPoint> points

) {
	public static ExplorationResponse of(Exploration exploration, List<Long> togetherDogIds) {
		return ExplorationResponse.builder()
			.explorationId(exploration.getId())
			.startTime(exploration.getStartAt())
			.endTime(exploration.getEndAt())
			.distance(exploration.getDistance())
			.togetherDogIds(togetherDogIds)
			.build();
	}

	public static ExplorationResponse of(Exploration exploration, List<Long> togetherDogs,
		List<ExplorationPoint> points) {
		return ExplorationResponse.builder()
			.explorationId(exploration.getId())
			.startTime(exploration.getStartAt())
			.endTime(exploration.getEndAt())
			.distance(exploration.getDistance())
			.togetherDogIds(togetherDogs)
			.points(points)
			.build();
	}
}
