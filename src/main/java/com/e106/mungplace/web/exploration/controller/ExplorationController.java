package com.e106.mungplace.web.exploration.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.e106.mungplace.web.exploration.dto.ExplorationStartResponse;
import com.e106.mungplace.web.exploration.service.ExplorationService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RequestMapping("/explorations")
@RestController
public class ExplorationController {

	private final ExplorationService explorationService;

	@PostMapping
	public ResponseEntity<ExplorationStartResponse> startExploration() {
		return ResponseEntity.status(HttpStatus.CREATED).body(explorationService.startExplorationProcess());
	}

	@ResponseStatus(HttpStatus.OK)
	@PatchMapping("/{explorationId}")
	public void endExploration(@PathVariable Long explorationId) {
		explorationService.endExplorationProcess(explorationId);
	}
}
