package com.e106.mungplace.domain.marker.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

import com.e106.mungplace.domain.marker.entity.Marker;

public interface MarkerRepository extends CrudRepository<Marker, UUID> {
}
