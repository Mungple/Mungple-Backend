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

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class DogService {

	private final DogRepository dogRepository;
	private final UserRepository userRepository;
	private final UserHelper userHelper;

	@Transactional
	public void createDogProcess(DogCreateRequest dogCreateRequest) {
		UserDetails userDetails = userHelper.getAuthenticatedUser();
		Long userId = Long.valueOf(userDetails.getUsername());
		int size = dogRepository.countDogsByUserUserId(userId);
		// TODO <홍성우> Exception 상세화
		if (size >= 5) {
			throw new RuntimeException("A user cannot own more than 5 dogs.");
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
		// TODO <홍성우> Exception 변경
		return dogRepository.findById(dogId)
			.orElseThrow(RuntimeException::new);
	}

	private void validateDogOwner(Dog dog, Long userId) {
		// TODO <홍성우> Exception 변경
		if (!Objects.equals(dog.getUser().getUserId(), userId)) {
			throw new RuntimeException();
		}
	}
}
