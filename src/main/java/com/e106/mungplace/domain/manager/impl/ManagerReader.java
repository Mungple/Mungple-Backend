package com.e106.mungplace.domain.manager.impl;

import org.springframework.stereotype.Component;

import com.e106.mungplace.domain.user.entity.ProviderName;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class ManagerReader {

	private final UserRepository userRepository;

	public User findOrCreateManager(String providerId) {
		return userRepository.findUserByProviderId(providerId).orElseGet(() -> createManager(providerId));
	}

	public User createManager(String providerId) {
		User newUser = User.builder()
			.providerId(providerId)
			.providerName(ProviderName.MANAGER)
			.nickname(providerId)
			.build();

		return userRepository.save(newUser);
	}
}
