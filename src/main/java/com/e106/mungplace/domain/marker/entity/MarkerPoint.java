package com.e106.mungplace.domain.marker.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.core.geo.GeoPoint;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Document(indexName = "marker_point")
public class MarkerPoint {

	@Id
	private UUID markerId;

	@Field(type = FieldType.Long)
	private Long userId;

	@Field(type = FieldType.Long)
	private Long explorationId;

	private GeoPoint point;

	@Column(nullable = false)
	@Field(type = FieldType.Date, format = DateFormat.date_hour_minute_second)
	private LocalDateTime createdAt;

	@Column(length = 20, nullable = false)
	@Enumerated(EnumType.STRING)
	private MarkerType type;
}
