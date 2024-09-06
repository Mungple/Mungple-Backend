package com.e106.mungplace.web.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.e106.mungplace.web.user.dto.UserInfoResponse;
import com.e106.mungplace.web.user.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class UserController {

	private final UserService userService;

	@GetMapping("/users/{userId}")
	public ResponseEntity<UserInfoResponse> findUserInfo(@PathVariable("userId") Long userId) {
		return ResponseEntity.ok(userService.readUserInfo(userId));
	}
}
