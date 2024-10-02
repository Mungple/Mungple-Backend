package com.e106.mungplace.web.mungple.controller;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.RestController;

import com.e106.mungplace.web.mungple.dto.MungpleRequest;
import com.e106.mungplace.web.mungple.service.MungpleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class MungpleController {

	private final MungpleService mungpleService;

	@MessageMapping("/mungple")
	public void getMungple(@Valid MungpleRequest mungpleRequest, Principal principal) {
		Long userId = Long.parseLong(principal.getName());

		mungpleService.sendMungpleToUser(mungpleRequest, userId);
	}
}
