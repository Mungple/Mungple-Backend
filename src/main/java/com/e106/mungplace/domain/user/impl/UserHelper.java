package com.e106.mungplace.domain.user.impl;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.e106.mungplace.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class UserHelper {

	private final UserRepository userRepository;

	public void validateUserExists(Long userId) {
		// TODO <fosong98> count(*) 쿼리가 나가는 문제 해결
		// TODO <fosong98> 예외 구체화 필요
		if (!userRepository.existsById(userId))
			throw new RuntimeException("사용자가 존재하지 않습니다.");
	}

	public void validateUserHasDog(Long userId) {
		// TODO <fosong98> 사용자 애견이 존재하는지 확인하는 메서드 구현
	}

	public UserDetails getAuthenticatedUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if(authentication == null) {
			// TODO <fosong98> 예외 구체화 필요
			throw new RuntimeException("Authentication is null");
		}
		return (UserDetails) authentication.getPrincipal();
	}

	public Long getCurrentUserId() {
		return Long.parseLong(getAuthenticatedUser().getUsername());
	}
}
