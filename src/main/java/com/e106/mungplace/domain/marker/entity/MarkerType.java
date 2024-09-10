package com.e106.mungplace.domain.marker.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MarkerType {

	RED("red"),
	BLUE("blue");

	private final String makerType;
}
