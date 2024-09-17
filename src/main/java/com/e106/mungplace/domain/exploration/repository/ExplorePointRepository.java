package com.e106.mungplace.domain.exploration.repository;

import org.springframework.data.repository.CrudRepository;

import com.e106.mungplace.domain.exploration.entity.ExplorePoint;

public interface ExplorePointRepository extends CrudRepository<ExplorePoint, String> {
}
