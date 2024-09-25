package com.e106.mungplace.web.marker.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RequestMarkerType {

	RED("red"),
	BLUE("blue"),
	ALL("all");

	private final String markerType;
}
