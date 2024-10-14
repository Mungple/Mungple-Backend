package com.e106.mungplace.domain.facility.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.e106.mungplace.domain.facility.entity.PetFacility;

public interface PetFacilityRepository extends JpaRepository<PetFacility, Long> {
}
