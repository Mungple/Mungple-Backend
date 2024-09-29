package com.e106.mungplace.web.facility.dto;

import com.e106.mungplace.domain.facility.entity.PetFacility;

import lombok.Builder;

@Builder
public record PetFacilityResponse(
	Long id,
	String name,
	String address,
	String phone,
	String homepage,
	String closedDays,
	String businessHours,
	String description
) {

	public static PetFacilityResponse of(PetFacility facility) {
		return PetFacilityResponse.builder()
			.id(facility.getId())
			.name(facility.getName())
			.address(facility.getAddress())
			.phone(facility.getPhone())
			.homepage(facility.getHomepage())
			.closedDays(facility.getClosedDays())
			.businessHours(facility.getBusinessHours())
			.description(facility.getDescription())
			.build();
	}
}
