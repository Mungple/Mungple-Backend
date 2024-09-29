package com.e106.mungplace.domain.exploration.repository;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.repository.CrudRepository;

import com.e106.mungplace.domain.exploration.entity.ExplorePoint;

import java.util.List;

public interface ExplorePointRepository extends CrudRepository<ExplorePoint, String> {

    List<ExplorePoint> findByExplorationId(Long explorationId);
}
