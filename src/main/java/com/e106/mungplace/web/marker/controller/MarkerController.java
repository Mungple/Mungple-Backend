package com.e106.mungplace.web.marker.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.e106.mungplace.web.marker.dto.GeohashMarkerResponse;
import com.e106.mungplace.web.marker.dto.MarkerSearchRequest;
import com.e106.mungplace.web.marker.service.MarkerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
public class MarkerController {

	private final MarkerService markerService;

	// TODO: <홍성우> markerId 반환
	@ResponseStatus(HttpStatus.CREATED)
	@PostMapping(value = "/markers", consumes = "multipart/form-data")
	public void createMarker(
		@RequestPart("MarkerCreateRequest") String markerInfoJson,
		@RequestPart(name = "image", required = false) List<MultipartFile> imageFiles) throws Exception {

		markerService.createMarkerProcess(markerInfoJson, imageFiles);
	}

	@ResponseStatus(HttpStatus.ACCEPTED)
	@PostMapping("/markers/{markerId}")
	public void deleteMarker(@PathVariable("markerId") Long markerId) {
		markerService.deleteMarkerProcess(markerId);
	}

	@GetMapping("/markers")
	public ResponseEntity<GeohashMarkerResponse> getGroupedMarkers(@RequestBody MarkerSearchRequest markerSearchRequest) {
		return ResponseEntity.ok(markerService.getMarkersGroupedByGeohash(markerSearchRequest));
	}
}