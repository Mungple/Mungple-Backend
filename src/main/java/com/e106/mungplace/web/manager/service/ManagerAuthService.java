package com.e106.mungplace.web.manager.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.e106.mungplace.domain.manager.impl.ManagerReader;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.web.user.dto.LoginResponse;
import com.e106.mungplace.web.util.JwtAuthenticationHelper;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ManagerAuthService {

	private final ManagerReader managerReader;
	private final JwtAuthenticationHelper jwtAuthenticationHelper;

	@Transactional
	public LoginResponse managerLoginProcess(String providerId) {
		User manager = managerReader.findOrCreateManager(providerId);
		return LoginResponse.builder()
			.accessToken(jwtAuthenticationHelper.createAccessToken(manager.getUserId()))
			.build();
	}
}
