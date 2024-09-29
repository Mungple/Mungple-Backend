package com.e106.mungplace.web.facility.dto;

import com.e106.mungplace.common.map.dto.Point;

public record PetFacilitySearchRequest(
	Integer radius,
	Point point
) {
}
