package com.e106.mungplace.repository;

import static org.assertj.core.api.Assertions.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import com.e106.mungplace.domain.user.entity.ProviderName;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.domain.user.repository.UserRepository;

@DataJpaTest
public class UserRepositoryTest {

	@Autowired
	private TestEntityManager entityManager;

	@Autowired
	private UserRepository userRepository;

	private User user;

	@BeforeEach
	public void setUp() {
		user = User.builder()
			.imageName("userImage.jpg")
			.nickname("Test User")
			.providerName(ProviderName.GOOGLE)
			.providerId("providerId123")
			.build();
		entityManager.persist(user);
		entityManager.flush();
	}

	@Test
	void testFindUserByProviderId() {
		Optional<User> foundUser = userRepository.findUserByProviderId("providerId123");
		assertThat(foundUser).isPresent();
		assertThat(foundUser.get().getProviderId()).isEqualTo("providerId123");
		assertThat(foundUser.get().getNickname()).isEqualTo("Test User");
	}

	@Test
	void testFindUserByProviderId_NotFound() {
		Optional<User> foundUser = userRepository.findUserByProviderId("nonExistingId");
		assertThat(foundUser).isNotPresent();
	}
}
