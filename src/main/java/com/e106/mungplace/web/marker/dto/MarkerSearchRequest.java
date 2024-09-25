package com.e106.mungplace.web.marker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;

@Getter
@Builder
@RequiredArgsConstructor
@ToString
@AllArgsConstructor
public class MarkerSearchRequest {

	private double radius;
	private double latitude;
	private double longitude;
	private RequestMarkerType markerType;
}
