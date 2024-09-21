package com.e106.mungplace.domain.marker.repository;

import java.util.UUID;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.e106.mungplace.domain.marker.entity.MarkerPoint;

public interface MarkerPointRepository extends ElasticsearchRepository<MarkerPoint, UUID> {
}