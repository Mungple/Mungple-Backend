package com.e106.mungplace.web.facility.dto;

import java.util.List;

public record PetFacilitySearchResponse(
	List<PetFacilityPointResponse> facilityPoints
) {
}
