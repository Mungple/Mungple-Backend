package com.e106.mungplace.domain.heatmap.event;

import java.time.LocalDateTime;

import com.e106.mungplace.common.map.dto.Point;

import lombok.Builder;

@Builder
public record HeatmapQueryEvent(
	Long userId,
	Point leftTop,
	Point rightBottom,
	Integer side,
	HeatmapQueryType queryType,
	LocalDateTime from,
	LocalDateTime to,
	LocalDateTime createdAt
) {
}