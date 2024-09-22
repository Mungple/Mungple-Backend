package com.e106.mungplace.domain.exploration.repository;

import com.e106.mungplace.domain.exploration.entity.DogExploration;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface DogExplorationRepository extends CrudRepository<DogExploration, Long> {
    @Query(value = "SELECT de FROM dog_exploration de WHERE de.dog.id = :dogId ORDER BY de.dogExplorationId DESC")
    Optional<DogExploration> findLatestByDogId(@Param("dogId") Long dogId);
}
