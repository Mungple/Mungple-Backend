package com.e106.mungplace.web.exploration.controller;

import com.e106.mungplace.web.exploration.dto.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import com.e106.mungplace.web.exploration.service.ExplorationService;

import lombok.RequiredArgsConstructor;

import java.time.LocalDate;

@RequiredArgsConstructor
@RequestMapping("/explorations")
@RestController
public class ExplorationController {

	private final SimpMessagingTemplate messagingTemplate;
	private final ExplorationService explorationService;

	@PostMapping
	public ResponseEntity<ExplorationStartResponse> startExploration(@RequestBody ExplorationStartWithDogsRequest dogs) {
		return ResponseEntity.status(HttpStatus.CREATED).body(explorationService.startExplorationProcess(dogs));
	}

	@ResponseStatus(HttpStatus.OK)
	@PatchMapping("/{explorationId}")
	public void endExploration(@PathVariable Long explorationId) {
		explorationService.endExplorationProcess(explorationId);
	}

	@GetMapping
	public ResponseEntity<ExplorationsResponse> findExplorationsOfMonth(@RequestParam int year, @RequestParam int month) {
		return ResponseEntity.ok(explorationService.findExplorationsOfMonthProcess(year, month));
	}

	@GetMapping("/days")
	public ResponseEntity<ExplorationsResponse> findExplorationsOfDay(@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
		return ResponseEntity.ok(explorationService.findExplorationsOfDayProcess(date));
	}

	@GetMapping("/{explorationId}")
	public ResponseEntity<ExplorationResponse> findExploration(@PathVariable Long explorationId) {
		return ResponseEntity.ok(explorationService.findExplorationProcess(explorationId));
	}

	@GetMapping("/statistics")
	public ResponseEntity<ExplorationStatisticResponse> findExplorationStatistics(@RequestParam int year, @RequestParam int month) {
		return ResponseEntity.ok(explorationService.findExplorationStatisticsProcess(year, month));
	}
	
	@MessageMapping("/exploration/{explorationId}")
	public void createExplorationEvent(ExplorationEventRequest eventRequest, @PathVariable Long explorationId) {
		explorationService.createExplorationEventProcess(eventRequest, explorationId);
		messagingTemplate.convertAndSend("/sub/common/" + explorationId, "Connect Success");
		// Todo <이현수> : 소켓 예외 처리
	}
}
