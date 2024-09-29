package com.e106.mungplace.web.marker.dto;

import java.util.UUID;

import com.e106.mungplace.domain.marker.entity.MarkerType;

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
	private MarkerType type;
	private Long explorationId;
}
