package com.e106.mungplace.web.dogs.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.e106.mungplace.web.dogs.dto.DogCreateRequest;
import com.e106.mungplace.web.dogs.dto.DogResponse;
import com.e106.mungplace.web.dogs.dto.DogUpdateRequest;
import com.e106.mungplace.web.dogs.service.DogService;
import com.e106.mungplace.web.user.dto.ImageNameResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/users")
public class DogController {

	private final DogService dogService;

	@PostMapping("/dogs")
	public ResponseEntity<DogResponse> findUserInfo(@Valid @RequestBody DogCreateRequest dogCreateRequest) {
		return ResponseEntity.status(HttpStatus.CREATED).body(dogService.createDogProcess(dogCreateRequest));
	}

	@GetMapping("/{userId}/dogs")
	public ResponseEntity<List<DogResponse>> findDogsInfo(@PathVariable("userId") Long userId) {
		return ResponseEntity.ok(dogService.findDogsProcess(userId));
	}

	@PutMapping("/dogs/{dogId}")
	public ResponseEntity<DogResponse> updateDogInfo(@PathVariable("dogId") Long dogId,
		@RequestBody DogUpdateRequest dogUpdateRequest) {
		return ResponseEntity.ok(dogService.updateDogProcess(dogId, dogUpdateRequest));
	}

	@ResponseStatus(HttpStatus.OK)
	@DeleteMapping("/dogs/{dogId}")
	public void removeDog(@PathVariable("dogId") Long dogId) {
		dogService.removeDogProcess(dogId);
	}

	@PostMapping(value = "/dogs/{dogId}/images", consumes = "multipart/form-data")
	public ResponseEntity<ImageNameResponse> updateDogImage(@PathVariable("dogId") Long dogId,
		@RequestPart(name = "image", required = true) MultipartFile imageFile) {
		return ResponseEntity.ok(dogService.updateDogImageProcess(dogId, imageFile));
	}
}
