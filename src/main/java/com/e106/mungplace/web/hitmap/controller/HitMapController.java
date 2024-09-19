package com.e106.mungplace.web.hitmap.controller;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Component;

import com.e106.mungplace.web.hitmap.dto.HitMapRequest;

@Component
public class HitMapController {

	@MessageMapping("/users/bluezone")
	public void getUserBluezone(HitMapRequest request, Principal principal) {

	}

	@MessageMapping("/bluezone")
	public void getBluezone(HitMapRequest request, Principal principal) {

	}

	@MessageMapping("/redzone")
	public void getRedzone(HitMapRequest request, Principal principal) {

	}
}
