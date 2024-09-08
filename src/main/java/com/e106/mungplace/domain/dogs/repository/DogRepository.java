package com.e106.mungplace.domain.dogs.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.e106.mungplace.domain.dogs.entity.Dog;

public interface DogRepository extends CrudRepository<Dog, Long> {

	int countDogsByUserUserId(Long userId);

	List<Dog> findByUserUserId(Long userId);
}