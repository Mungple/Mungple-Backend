package com.e106.mungplace.domain.exploration.entity;

import java.time.LocalDateTime;

import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.core.geo.GeoPoint;

import com.e106.mungplace.common.map.dto.Point;

import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
@Document(indexName = "explore_point")
public class ExplorePoint {

	@Id
	private String id;

	@Field(type = FieldType.Long)
	private Long userId;

	@Field(type = FieldType.Long)
	private Long explorationId;

	private GeoPoint point;

	@Field(type = FieldType.Date, format = DateFormat.date_hour_minute_second)
	private LocalDateTime recordedAt;

	@Builder
	public ExplorePoint(Long userId, Long explorationId, Point point, LocalDateTime recordedAt) {
		this.userId = userId;
		this.explorationId = explorationId;
		this.point = new GeoPoint(point.lat(), point.lon());
		this.recordedAt = recordedAt;
	}
}
