package com.e106.mungplace.web.hitmap.dto;

import java.time.LocalDateTime;

import org.springframework.data.elasticsearch.core.geo.GeoPoint;
import org.springframework.data.geo.Point;

import com.e106.mungplace.domain.hitmap.event.HitMapQueryEvent;
import com.e106.mungplace.domain.hitmap.event.HitMapQueryType;
import com.e106.mungplace.domain.util.GeoUtils;

public record HitMapRequest(
	Point point,
	Integer side
) {

	public HitMapQueryEvent toEvent(Long userId, HitMapQueryType queryType) {
		Point nw = GeoUtils.calculateNorthWestPoint(point, side);
		Point se = GeoUtils.calculateSouthEastPoint(point, side);

		return HitMapQueryEvent.builder()
			.userId(userId)
			.side(side)
			.queryType(queryType)
			.leftTop(new GeoPoint(nw.getX(), nw.getY()))
			.rightBottom(new GeoPoint(se.getX(), se.getX()))
			.createdAt(LocalDateTime.now())
			.build();
	}
}
