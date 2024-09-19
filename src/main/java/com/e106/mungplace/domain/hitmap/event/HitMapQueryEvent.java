package com.e106.mungplace.domain.hitmap.event;

import java.time.LocalDateTime;

import org.springframework.data.elasticsearch.core.geo.GeoPoint;

import lombok.Builder;

@Builder
public record HitMapQueryEvent(
	Long userId,
	GeoPoint leftTop,
	GeoPoint rightBottom,
	Integer side,
	HitMapQueryType queryType,
	LocalDateTime createdAt
) {
}