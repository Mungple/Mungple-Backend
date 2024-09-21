package com.e106.mungplace.domain.heatmap.dto;

import com.e106.mungplace.common.map.dto.Point;
import com.e106.mungplace.domain.util.GeoUtils;

import co.elastic.clients.elasticsearch._types.aggregations.GeoHashGridBucket;

public record HeatmapCell(
	Point point,
	Long weight
) {

	public static HeatmapCell of(GeoHashGridBucket bucket) {
		var center = GeoUtils.calculateGeohashCenterPoint(bucket.key());
		return new HeatmapCell(center, bucket.docCount());
	}
}