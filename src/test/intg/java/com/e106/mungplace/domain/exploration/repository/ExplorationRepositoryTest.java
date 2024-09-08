package com.e106.mungplace.domain.exploration.repository;

import static org.assertj.core.api.Assertions.*;

import java.time.LocalDateTime;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import net.bytebuddy.utility.RandomString;

import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.user.entity.ProviderName;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.domain.user.repository.UserRepository;

@DataJpaTest
class ExplorationRepositoryTest {

	@Autowired
	private ExplorationRepository explorationRepository;

	@Autowired
	private UserRepository userRepository;

	@DisplayName("EndAt이 null인 산책이 있는지 조회한다.")
	@Test
	void When_CheckUsersEndAtNullData_Then_ReturnTrue() {
		// given
		User user = new User(RandomString.make(), ProviderName.NAVER, RandomString.make(), RandomString.make());
		userRepository.save(user);
		Exploration exploration = new Exploration(user, LocalDateTime.now());
		explorationRepository.save(exploration);

		// when
		boolean isExists = explorationRepository.existsByUserAndEndAtIsNull(user);

		// then
		assertThat(isExists).isTrue();
	}
}