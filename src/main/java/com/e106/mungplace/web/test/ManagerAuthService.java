package com.e106.mungplace.web.test;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.e106.mungplace.domain.user.entity.ProviderName;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.domain.user.repository.UserRepository;
import com.e106.mungplace.web.user.dto.LoginResponse;
import com.e106.mungplace.web.util.JwtProvider;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ManagerAuthService {

	private final UserRepository userRepository;
	private final JwtProvider jwtProvider;

	@Transactional
	public LoginResponse managerLoginProcess(String providerId) {
		User manager = findOrCreateManager(providerId);
		return LoginResponse.builder().accessToken(jwtProvider.createAccessToken(manager.getUserId())).build();
	}

	private User findOrCreateManager(String providerId) {
		return userRepository.findUserByProviderId(providerId).orElseGet(() -> createAdminAccount(providerId));
	}

	private User createAdminAccount(String providerId) {
		User newUser = User.builder()
			.providerId(providerId)
			.providerName(ProviderName.MANAGER)
			.nickname(providerId)
			.build();

		return userRepository.save(newUser);
	}
}
