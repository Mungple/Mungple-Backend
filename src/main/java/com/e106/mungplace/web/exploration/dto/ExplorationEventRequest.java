package com.e106.mungplace.web.exploration.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExplorationEventRequest {

	private Long userId;

	@NotNull
	private String lat;

	@NotNull
	private String lon;

	@NotNull
	private LocalDateTime recordedAt;

	public static ExplorationEventRequest of(Long userId, String lat, String lon) {
		return ExplorationEventRequest.builder()
			.userId(userId)
			.lat(lat)
			.lon(lon)
			.recordedAt(LocalDateTime.now())
			.build();
	}
}
