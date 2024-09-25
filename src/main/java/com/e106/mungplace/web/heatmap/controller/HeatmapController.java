package com.e106.mungplace.web.heatmap.controller;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import com.e106.mungplace.web.heatmap.dto.HeatmapRequest;
import com.e106.mungplace.web.heatmap.service.HeatmapQueryListenerService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
public class HeatmapController {

	private final HeatmapQueryListenerService heatmapQueryListenerService;

	@MessageMapping("/users/bluezone")
	public void getUserBluezone(HeatmapRequest request, Principal principal) {
		Long userId = Long.parseLong(principal.getName());
		heatmapQueryListenerService.userBluezoneQueryProcess(userId, request);
	}

	@MessageMapping("/bluezone")
	public void getBluezone(HeatmapRequest request, Principal principal) {
		Long userId = Long.parseLong(principal.getName());
		heatmapQueryListenerService.bluezoneQueryProcess(userId, request);
	}

	@MessageMapping("/redzone")
	public void getRedzone(HeatmapRequest request, Principal principal) {
		Long userId = Long.parseLong(principal.getName());
		heatmapQueryListenerService.redzoneQueryProcess(userId, request);
	}
}
