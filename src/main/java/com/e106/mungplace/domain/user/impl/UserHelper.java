package com.e106.mungplace.domain.user.impl;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.e106.mungplace.domain.user.repository.UserRepository;
import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exception.dto.ApplicationError;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class UserHelper {

	private final UserRepository userRepository;

	public void validateUserExists(Long userId) {
		// TODO <fosong98> count(*) 쿼리가 나가는 문제 해결
		if (!userRepository.existsById(userId))
			throw new ApplicationException(ApplicationError.USER_NOT_FOUND);
	}

	public void validateUserHasDog(Long userId) {
		// TODO <fosong98> 사용자 애견이 존재하는지 확인하는 메서드 구현
	}

	public UserDetails getAuthenticatedUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if(authentication == null) {
			throw new ApplicationException(ApplicationError.AUTHENTICATION_ERROR);
		}
		return (UserDetails) authentication.getPrincipal();
	}

	public Long getCurrentUserId() {
		return Long.parseLong(getAuthenticatedUser().getUsername());
	}
}
