package com.e106.mungplace.web.exploration.controller;

import java.security.Principal;
import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.e106.mungplace.web.exploration.dto.ExplorationEventRequest;
import com.e106.mungplace.web.exploration.dto.ExplorationResponse;
import com.e106.mungplace.web.exploration.dto.ExplorationStartResponse;
import com.e106.mungplace.web.exploration.dto.ExplorationStartWithDogsRequest;
import com.e106.mungplace.web.exploration.dto.ExplorationStatisticResponse;
import com.e106.mungplace.web.exploration.dto.ExplorationsResponse;
import com.e106.mungplace.web.exploration.service.ExplorationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RequestMapping("/explorations")
@RestController
public class ExplorationController {

	private final ExplorationService explorationService;

	@PostMapping
	public ResponseEntity<ExplorationStartResponse> startExploration(
		@Validated @RequestBody ExplorationStartWithDogsRequest dogs) {
		return ResponseEntity.status(HttpStatus.CREATED).body(explorationService.startExplorationProcess(dogs));
	}

	@ResponseStatus(HttpStatus.OK)
	@PatchMapping("/{explorationId}")
	public void endExploration(@PathVariable Long explorationId) {
		explorationService.endExplorationProcess(explorationId);
	}

	@GetMapping
	public ResponseEntity<ExplorationsResponse> findExplorationsOfMonth(@RequestParam int year,
		@RequestParam int month) {
		return ResponseEntity.ok(explorationService.findExplorationsOfMonthProcess(year, month));
	}

	@GetMapping("/days")
	public ResponseEntity<ExplorationsResponse> findExplorationsOfDay(
		@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
		return ResponseEntity.ok(explorationService.findExplorationsOfDayProcess(date));
	}

	@GetMapping("/{explorationId}")
	public ResponseEntity<ExplorationResponse> findExploration(@PathVariable Long explorationId) {
		return ResponseEntity.ok(explorationService.findExplorationProcess(explorationId));
	}

	@GetMapping("/statistics")
	public ResponseEntity<ExplorationStatisticResponse> findExplorationStatistics(@RequestParam int year,
		@RequestParam int month) {
		return ResponseEntity.ok(explorationService.findExplorationStatisticsProcess(year, month));
	}

	@MessageMapping("/explorations/{explorationId}")
	public void createExplorationEvent(@Valid ExplorationEventRequest eventRequest,
		@DestinationVariable Long explorationId, Principal principal) {
		explorationService.createExplorationEventProcess(eventRequest, explorationId, principal);
	}
}
