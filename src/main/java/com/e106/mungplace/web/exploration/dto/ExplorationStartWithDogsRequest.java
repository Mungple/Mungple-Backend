package com.e106.mungplace.web.exploration.dto;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record ExplorationStartWithDogsRequest(

	@NotNull
	String lat,

	@NotNull
	String lon,

	@NotNull
	List<Long> dogIds
) {
}
