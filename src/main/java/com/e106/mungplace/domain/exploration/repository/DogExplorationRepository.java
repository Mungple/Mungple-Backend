package com.e106.mungplace.domain.exploration.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.e106.mungplace.domain.exploration.entity.DogExploration;

public interface DogExplorationRepository extends JpaRepository<DogExploration, Long> {
	@Query(value = "SELECT de FROM dog_exploration de WHERE de.dog.id = :dogId ORDER BY de.dogExplorationId DESC")
	Optional<DogExploration> findLatestByDogId(@Param("dogId") Long dogId);

	List<DogExploration> findDogExplorationsByExplorationId(Long explorationId);
}
