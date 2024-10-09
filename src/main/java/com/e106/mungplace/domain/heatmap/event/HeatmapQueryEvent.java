package com.e106.mungplace.domain.heatmap.event;

import java.time.LocalDateTime;

import com.e106.mungplace.common.map.dto.Point;
import com.e106.mungplace.domain.heatmap.dto.HeatmapSearchCondition;

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

	public static HeatmapQueryEvent of(HeatmapSearchCondition event, String requestId, Long userId, HeatmapQueryType queryType) {
		return HeatmapQueryEvent.builder()
			.userId(userId)
			.leftTop(event.nw())
			.rightBottom(event.se())
			.queryType(queryType)
			.from(event.start())
			.to(event.end())
			.createdAt(LocalDateTime.now())
			.build();
	}
}