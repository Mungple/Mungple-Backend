package com.e106.mungplace.web.marker.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.e106.mungplace.domain.marker.entity.Marker;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MarkerResponse {

	private UUID markerId;
	private String title;
	private Double lat;
	private Double lon;
	private LocalDateTime createdAt;
	private RequestMarkerType markerType;

	public static MarkerResponse of(Marker marker) {
		return MarkerResponse.builder()
			.markerId(marker.getId())
			.title(marker.getTitle())
			.createdAt(marker.getCreatedDate())
			.lat(marker.getLat())
			.lon(marker.getLon())
			.markerType(RequestMarkerType.valueOf(marker.getType().getMakerType().toUpperCase()))
			.build();
	}
}