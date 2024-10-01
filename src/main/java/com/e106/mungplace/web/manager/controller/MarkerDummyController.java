package com.e106.mungplace.web.manager.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.e106.mungplace.web.manager.dto.ManagerExplorePointCreateRequest;
import com.e106.mungplace.web.manager.dto.ManagerMarkerDummyCreateRequest;
import com.e106.mungplace.web.manager.service.ManagerMarkerDummyService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RequestMapping("/manager/markers")
@RestController
public class MarkerDummyController {

	private final ResourceLoader resourceLoader;
	private final ManagerMarkerDummyService markerService;

	@ResponseStatus(HttpStatus.CREATED)
	@PostMapping
	public void createMarkerDummy(@RequestBody ManagerMarkerDummyCreateRequest request) {
		markerService.createMarkerDummyProcess(request);
	}

	@GetMapping(value = "/csv", produces = "text/csv")
	public ResponseEntity<Resource> getMarkersCsv() {
		try {
			String filename = "data/markerData.csv";
			Resource resource = resourceLoader.getResource("classpath:" + filename);

			HttpHeaders headers = new HttpHeaders();
			headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=markerData"
				+ ".csv");

			return ResponseEntity.ok()
				.headers(headers)
				.contentLength(resource.contentLength())
				.contentType(MediaType.parseMediaType("text/csv"))
				.body(resource);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
}
