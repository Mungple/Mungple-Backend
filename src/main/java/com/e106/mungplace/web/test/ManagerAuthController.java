package com.e106.mungplace.web.test;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.e106.mungplace.web.user.dto.LoginResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
@RequestMapping("/manager")
@RestController
public class ManagerAuthController {

	private final ManagerAuthService managerAuthService;

	@PostMapping("/login")
	public ResponseEntity<LoginResponse> testLogin(@RequestParam String username) {
		return ResponseEntity.ok(managerAuthService.managerLoginProcess(username));
	}
}

