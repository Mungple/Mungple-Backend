package com.e106.mungplace.domain.manager.impl;

import java.time.LocalDate;
import java.util.Random;

import org.springframework.stereotype.Component;

import com.e106.mungplace.domain.dogs.entity.Dog;
import com.e106.mungplace.domain.dogs.entity.Gender;
import com.e106.mungplace.domain.dogs.repository.DogRepository;
import com.e106.mungplace.domain.user.entity.ProviderName;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class ManagerReader {

	private final UserRepository userRepository;
	private final DogRepository dogRepository;
	private final Random random = new Random();


	public User findOrCreateManager(String providerId) {
		return userRepository.findUserByProviderId(providerId).orElseGet(() -> createManager(providerId));
	}

	public User createManager(String providerId) {
		User newUser = User.builder()
			.providerId(providerId)
			.providerName(ProviderName.MANAGER)
			.nickname(providerId)
			.build();

		userRepository.save(newUser);

		int i = random.nextInt(3);

		Dog newDog = Dog.builder()
			.user(newUser)
			.birth(LocalDate.now())
			.dogName(newUser.getNickname() + " " + "바둑이")
			.imageName("바둑이" + i + ".png")
			.gender(i % 2 == 1 ? Gender.FEMALE : Gender.MALE)
			.isDefault(true)
			.weight(3000)
			.build();

		dogRepository.save(newDog);

		return newUser;
	}
}
