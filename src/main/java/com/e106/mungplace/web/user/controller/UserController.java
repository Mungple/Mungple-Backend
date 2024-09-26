package com.e106.mungplace.web.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.e106.mungplace.web.user.dto.ImageNameResponse;
import com.e106.mungplace.web.user.dto.UserInfoResponse;
import com.e106.mungplace.web.user.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/users")
public class UserController {

	private final UserService userService;

	@GetMapping("/{userId}")
	public ResponseEntity<UserInfoResponse> findUserInfo(@PathVariable("userId") Long userId) {
		return ResponseEntity.ok(userService.readUserInfo(userId));
	}

	@PostMapping(value = "/image", consumes = "multipart/form-data")
	public ResponseEntity<ImageNameResponse> updateUserImage(@RequestPart(name = "image", required = true) MultipartFile imageFile) {
		return ResponseEntity.ok(userService.updateUserImage(imageFile));
	}
}
