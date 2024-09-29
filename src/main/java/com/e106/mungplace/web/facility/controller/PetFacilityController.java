package com.e106.mungplace.web.facility.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.e106.mungplace.web.facility.dto.PetFacilityResponse;
import com.e106.mungplace.web.facility.dto.PetFacilitySearchRequest;
import com.e106.mungplace.web.facility.dto.PetFacilitySearchResponse;
import com.e106.mungplace.web.facility.service.PetFacilityService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RequestMapping("/pet-facilities")
@RestController
public class PetFacilityController {

	private final PetFacilityService petFacilityService;

	@GetMapping
	public ResponseEntity<PetFacilitySearchResponse> search(PetFacilitySearchRequest request) {
		return ResponseEntity.ok(petFacilityService.searchNearbyPetFacilityProcess(request.point(), request.radius()));
	}

	@GetMapping("/{facilityId}")
	public ResponseEntity<PetFacilityResponse> get(@PathVariable("facilityId") Long facilityId) {
		return ResponseEntity.ok(petFacilityService.getPetFacilityById(facilityId));
	}
}
