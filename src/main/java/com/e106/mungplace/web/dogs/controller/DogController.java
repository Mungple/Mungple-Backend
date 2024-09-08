package com.e106.mungplace.web.dogs.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

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

	@ResponseStatus(HttpStatus.CREATED)
	@PostMapping("/users/dogs")
	public void findUserInfo(@RequestBody DogCreateRequest dogCreateRequest) {
		dogService.createDogProcess(dogCreateRequest);
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
}
