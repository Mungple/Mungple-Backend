package com.e106.mungplace.domain.user.repository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import net.bytebuddy.utility.RandomString;

import com.e106.mungplace.domain.user.entity.ProviderName;
import com.e106.mungplace.domain.user.entity.User;

@DataJpaTest
class UserRepositoryTest {

	@Autowired
	private UserRepository userRepository;

	@DisplayName("existsById 사용 시 limit 1이 동작하는지 확인")
	@Test
	void When_CallExistsById_Then_UseLimit1() {
		// given
		User user = new User(RandomString.make(), ProviderName.GOOGLE, RandomString.make(), RandomString.make());
		userRepository.save(user);

		// when
		// => select count(*) from users u1_0 where u1_0.user_id=?
		userRepository.existsById(user.getUserId());

		// then
	}
}