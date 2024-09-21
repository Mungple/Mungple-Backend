package com.e106.mungplace.web.heatmap.controller;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Component;

import com.e106.mungplace.web.heatmap.dto.HeatmapRequest;

@Component
public class HeatmapController {

	@MessageMapping("/users/bluezone")
	public void getUserBluezone(HeatmapRequest request, Principal principal) {

	}

	@MessageMapping("/bluezone")
	public void getBluezone(HeatmapRequest request, Principal principal) {

	}

	@MessageMapping("/redzone")
	public void getRedzone(HeatmapRequest request, Principal principal) {

	}
}
