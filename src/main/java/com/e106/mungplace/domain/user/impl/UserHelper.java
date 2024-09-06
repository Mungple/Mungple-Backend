package com.e106.mungplace.domain.user.impl;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class UserHelper {

	public UserDetails getAuthenticatedUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if(authentication == null) {
			throw new RuntimeException("Authentication is null");
		}
		return (UserDetails) authentication.getPrincipal();
	}
}
