package com.e106.mungplace.domain.heatmap.dto;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.core.geo.GeoPoint;

import com.e106.mungplace.common.map.dto.Point;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
@Document(indexName = "redzone_point")
public class RedzonePoint {

	@Id
	private String id;

	private GeoPoint point;

	@Field(type = FieldType.Date, format = DateFormat.date_hour_minute_second)
	private LocalDateTime recordedAt;

	public RedzonePoint(Point point, LocalDateTime recordedAt) {
		this.point = new GeoPoint(point.lat(), point.lon());
		this.recordedAt = recordedAt;
	}
}
