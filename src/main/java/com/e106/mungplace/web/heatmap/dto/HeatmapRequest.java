package com.e106.mungplace.web.heatmap.dto;

import java.time.LocalDateTime;

import com.e106.mungplace.common.map.dto.Point;
import com.e106.mungplace.domain.heatmap.event.HeatmapQueryEvent;
import com.e106.mungplace.domain.heatmap.event.HeatmapQueryType;
import com.e106.mungplace.domain.util.GeoUtils;

public record HeatmapRequest(
	Point point,
	Integer side
) {

	public HeatmapQueryEvent toEvent(Long userId, HeatmapQueryType queryType, LocalDateTime from, LocalDateTime to) {
		Point nw = GeoUtils.calculateNorthWestPoint(point, side);
		Point se = GeoUtils.calculateSouthEastPoint(point, side);

		return HeatmapQueryEvent.builder()
			.userId(userId)
			.side(side)
			.queryType(queryType)
			.leftTop(nw)
			.rightBottom(se)
			.createdAt(LocalDateTime.now())
			.from(from)
			.to(to)
			.build();
	}
}
