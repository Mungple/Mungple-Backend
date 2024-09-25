package com.e106.mungplace.web.user.service;

import org.springframework.stereotype.Service;

import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exception.dto.ApplicationError;
import com.e106.mungplace.web.user.dto.UserInfoResponse;
import com.e106.mungplace.domain.user.repository.UserRepository;
import com.e106.mungplace.domain.user.impl.UserHelper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserService {

	private final UserRepository userRepository;
	private final UserHelper userHelper;

	public UserInfoResponse readUserInfo(Long userId) {
		return userRepository.findById(userId)
			.map(targetUser -> UserInfoResponse.builder()
				.userId(targetUser.getUserId())
				.nickname(targetUser.getNickname())
				.imageName(targetUser.getImageName())
				.build())
			.orElseThrow(() -> new ApplicationException(ApplicationError.USER_NOT_FOUND));
	}
}