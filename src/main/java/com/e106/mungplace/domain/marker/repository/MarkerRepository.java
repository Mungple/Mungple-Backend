package com.e106.mungplace.domain.marker.repository;

import org.springframework.data.repository.CrudRepository;

import com.e106.mungplace.domain.marker.entity.Marker;

public interface MarkerRepository extends CrudRepository<Marker, Long> {
}
