package com.e106.mungplace.domain.exploration.entity;

import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.core.geo.GeoPoint;

import jakarta.persistence.Id;
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

	public ExplorePoint(Long userId, Long explorationId, GeoPoint point) {
		this.userId = userId;
		this.explorationId = explorationId;
		this.point = point;
	}
}
