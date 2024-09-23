package com.e106.mungplace.domain.heatmap.event;

import lombok.Getter;

public enum HeatmapQueryType {

	USER_BLUEZONE("userbluezone"), BLUEZONE("bluezone"), REDZONE("redzone");

	@Getter
	private final String value;

	HeatmapQueryType(String value) {
		this.value = value;
	}
}
