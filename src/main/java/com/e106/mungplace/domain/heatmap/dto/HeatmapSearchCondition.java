package com.e106.mungplace.domain.heatmap.dto;

import java.time.LocalDateTime;

import com.e106.mungplace.common.map.dto.Point;

public record HeatmapSearchCondition(
	Point nw,
	Point se,
	LocalDateTime start,
	LocalDateTime end
) {
}
