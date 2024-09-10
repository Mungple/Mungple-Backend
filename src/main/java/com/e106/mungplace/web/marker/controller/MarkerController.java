package com.e106.mungplace.web.marker.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.e106.mungplace.web.marker.dto.MarkerCreateRequest;
import com.e106.mungplace.web.marker.service.MarkerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
public class MarkerController {

	private final MarkerService markerService;

	@ResponseStatus(HttpStatus.CREATED)
	@PostMapping("/markers")
	public void createMarker(@RequestBody MarkerCreateRequest markerInfo) {
		markerService.createMarkerProcess(markerInfo);
	}

	@ResponseStatus(HttpStatus.ACCEPTED)
	@PostMapping("/markers/{markerId}")
	public void deleteMarker(@PathVariable("markerId") Long markerId) {
		markerService.deleteMarkerProcess(markerId);
	}
}