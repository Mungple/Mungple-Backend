package com.e106.mungplace.web.marker.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.e106.mungplace.web.marker.dto.CreateMarkerResponse;
import com.e106.mungplace.web.marker.dto.GeohashMarkerResponse;
import com.e106.mungplace.web.marker.dto.MarkerInfoResponse;
import com.e106.mungplace.web.marker.dto.MarkerResponse;
import com.e106.mungplace.web.marker.dto.MarkerSearchRequest;
import com.e106.mungplace.web.marker.service.MarkerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/markers")
public class MarkerController {

	private final MarkerService markerService;

	@PostMapping(consumes = "multipart/form-data")
	public ResponseEntity<CreateMarkerResponse> createMarker(
		@RequestPart("MarkerCreateRequest") String markerInfoJson,
		@RequestPart(name = "image", required = false) List<MultipartFile> imageFiles) throws Exception {

		return ResponseEntity.ok(markerService.createMarkerProcess(markerInfoJson, imageFiles));
	}

	@ResponseStatus(HttpStatus.ACCEPTED)
	@DeleteMapping("/{markerId}")
	public void deleteMarker(@PathVariable("markerId") UUID markerId) {
		markerService.deleteMarkerProcess(markerId);
	}

	@GetMapping("/users")
	public ResponseEntity<List<MarkerResponse>> getUserMarkers(	@RequestParam Long size,
		@RequestParam(required = false) UUID cursorId) {
		List<MarkerResponse> markers = markerService.getUserMarkers(size, cursorId);
		return ResponseEntity.ok(markers);
	}

	@GetMapping
	public ResponseEntity<GeohashMarkerResponse> getGroupedMarkers(
		@ModelAttribute MarkerSearchRequest markerSearchRequest) {
		return ResponseEntity.ok(markerService.getMarkersGroupedByGeohash(markerSearchRequest));
	}

	@GetMapping("/{markerId}")
	public ResponseEntity<MarkerInfoResponse> getMarkerInfo(@PathVariable("markerId") UUID markerId) {
		return ResponseEntity.ok(markerService.getMarkerInfo(markerId));
	}
}