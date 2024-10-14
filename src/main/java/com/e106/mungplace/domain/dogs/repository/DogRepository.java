package com.e106.mungplace.domain.dogs.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.e106.mungplace.domain.dogs.entity.Dog;

public interface DogRepository extends JpaRepository<Dog, Long> {

	Integer countDogsByUserUserId(Long userId);

	List<Dog> findByUserUserId(Long userId);
}