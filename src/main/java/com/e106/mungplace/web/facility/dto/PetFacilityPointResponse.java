package com.e106.mungplace.web.facility.dto;

import com.e106.mungplace.common.map.dto.Point;
import com.e106.mungplace.domain.facility.entity.PetFacility;
import com.e106.mungplace.domain.facility.entity.PetFacilityPoint;

public record PetFacilityPointResponse(
	Long id,
	Point point
) {

	public static PetFacilityPointResponse of(PetFacilityPoint petFacility) {
		return new PetFacilityPointResponse(petFacility.getFacilityId(), Point.of(petFacility.getPoint()));
	}
}
