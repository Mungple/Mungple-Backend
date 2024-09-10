package com.e106.mungplace.domain.user.repository;

import static org.assertj.core.api.Assertions.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import com.e106.mungplace.domain.user.entity.ProviderName;
import com.e106.mungplace.domain.user.entity.User;

@DataJpaTest
class UserRepositoryTest {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private TestEntityManager entityManager;

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

	@DisplayName("existsById 사용 시 limit 1이 동작하는지 확인")
	@Test
	void When_CallExistsById_Then_UseLimit1() {
		// given
		userRepository.save(user);

		// when
		// => select count(*) from users u1_0 where u1_0.user_id=?
		userRepository.existsById(user.getUserId());

		// then
	}

	@DisplayName("유효한 providerID로 찾을시 유저 반환")
	@Test
	void when_FindUserByProviderId_thenReturn_User() {
		// given

		// when
		Optional<User> foundUser = userRepository.findUserByProviderId("providerId123");

		// then
		assertThat(foundUser).isPresent();
		assertThat(foundUser.get().getProviderId()).isEqualTo("providerId123");
		assertThat(foundUser.get().getNickname()).isEqualTo("Test User");
	}

	@DisplayName("유효하지 않은 providerID로 찾을시 유저 반환")
	@Test
	void when_FindUserByProviderId_NotFound_thenReturn_Empty() {
		// given

		// when
		Optional<User> foundUser = userRepository.findUserByProviderId("nonExistingId");

		// then
		assertThat(foundUser).isNotPresent();
	}
}