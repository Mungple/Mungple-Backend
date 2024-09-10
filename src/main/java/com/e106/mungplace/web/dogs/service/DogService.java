package com.e106.mungplace.web.dogs.service;

import java.util.List;
import java.util.Objects;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.e106.mungplace.domain.dogs.entity.Dog;
import com.e106.mungplace.domain.dogs.repository.DogRepository;
import com.e106.mungplace.domain.user.impl.UserHelper;
import com.e106.mungplace.domain.user.repository.UserRepository;
import com.e106.mungplace.web.dogs.dto.DogCreateRequest;
import com.e106.mungplace.web.dogs.dto.DogResponse;
import com.e106.mungplace.web.dogs.dto.DogUpdateRequest;
import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exception.dto.ApplicationError;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class DogService {

	private static final int MAX_DOG_CAPACITY = 5;

	private final DogRepository dogRepository;
	private final UserRepository userRepository;
	private final UserHelper userHelper;

	@Transactional
	public void createDogProcess(DogCreateRequest dogCreateRequest) {
		UserDetails userDetails = userHelper.getAuthenticatedUser();
		Long userId = Long.valueOf(userDetails.getUsername());
		int size = dogRepository.countDogsByUserUserId(userId);

		if (size >= MAX_DOG_CAPACITY) {
			throw new ApplicationException(ApplicationError.EXCEED_DOG_CAPACITY);
		}

		Dog dog = dogCreateRequest.toEntity();
		userRepository.findById(userId).ifPresent(dog::updateDogOwner);

		dog.updateDefaultDog(size == 0);
		dogRepository.save(dog);
	}

	public List<DogResponse> findDogsProcess(Long userId) {
		List<Dog> dogs = dogRepository.findByUserUserId(userId);
		return dogs.stream()
			.map(DogResponse::of)
			.toList();
	}

	@Transactional
	public DogResponse updateDogProcess(Long dogId, DogUpdateRequest dogUpdateRequest) {
		UserDetails userDetails = userHelper.getAuthenticatedUser();
		Long userId = Long.valueOf(userDetails.getUsername());

		Dog dog = checkDogExists(dogId);
		validateDogOwner(dog, userId);
		updateDogFromRequest(dog, dogUpdateRequest);

		return DogResponse.of(dog);
	}

	private void updateDogFromRequest(Dog dog, DogUpdateRequest request) {
		dog.updateDogName(request.getPetName());
		dog.updateBirth(dog.getBirth());
		dog.updateGender(dog.getGender());
		dog.updateWeight(dog.getWeight());
	}

	private Dog checkDogExists(Long dogId) {
		return dogRepository.findById(dogId)
			.orElseThrow(() -> new ApplicationException(ApplicationError.DOG_NOT_FOUND));
	}

	private void validateDogOwner(Dog dog, Long userId) {
		if (!Objects.equals(dog.getUser().getUserId(), userId)) {
			throw new ApplicationException(ApplicationError.DOG_NOT_OWNER);
		}
	}
}
