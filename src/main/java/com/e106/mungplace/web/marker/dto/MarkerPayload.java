package com.e106.mungplace.web.marker.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MarkerPayload {

	private UUID markerId;
	private Long userId;
	private String title;
	private Double lat;
	private Double lon;
	private String type;
	private Long explorationId;
}
