package com.e106.mungplace.domain.facility.entity;

import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.core.geo.GeoPoint;

import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
@Document(indexName = "pet_facility_point")
public class PetFacilityPoint {

	@Id
	private String id;

	@Field(type = FieldType.Long)
	private Long facilityId;

	private GeoPoint point;

	public PetFacilityPoint(Long facilityId, GeoPoint point) {
		this.facilityId = facilityId;
		this.point = point;
	}
}
