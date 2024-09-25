package com.e106.mungplace.web.dogs.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.e106.mungplace.web.dogs.dto.DogCreateRequest;
import com.e106.mungplace.web.dogs.dto.DogResponse;
import com.e106.mungplace.web.dogs.dto.DogUpdateRequest;
import com.e106.mungplace.web.dogs.service.DogService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
public class DogController {

	private final DogService dogService;

	@PostMapping("/users/dogs")
	public ResponseEntity<DogResponse> findUserInfo(@RequestBody DogCreateRequest dogCreateRequest) {
		return ResponseEntity.status(HttpStatus.CREATED).body(dogService.createDogProcess(dogCreateRequest));
	}

	@GetMapping("/users/{userId}/dogs")
	public ResponseEntity<List<DogResponse>> findDogsInfo(@PathVariable("userId") Long userId) {
		return ResponseEntity.ok(dogService.findDogsProcess(userId));
	}

	@PutMapping("/users/dogs/{dogId}")
	public ResponseEntity<DogResponse> updateDogInfo(@PathVariable("dogId") Long dogId,
		@RequestBody DogUpdateRequest dogUpdateRequest) {
		return ResponseEntity.ok(dogService.updateDogProcess(dogId, dogUpdateRequest));
	}

	@ResponseStatus(HttpStatus.OK)
	@DeleteMapping("/users/dogs/{dogId}")
	public void removeDog(@PathVariable("dogId") Long dogId) {
		dogService.removeDogProcess(dogId);
	}
}
