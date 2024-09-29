package com.e106.mungplace.web.user.service;

import com.e106.mungplace.domain.user.entity.ProviderName;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.domain.user.repository.UserRepository;
import com.e106.mungplace.web.user.dto.UserInfoResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.temporal.ChronoUnit;

@ActiveProfiles("intg")
@SpringBootTest
class UserServiceIntgTest {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserService userService;

	private User savedUser;

	@BeforeEach
	void setUp() {
		// given
		User user = new User("test-id", ProviderName.MANAGER, "test-nickname", "default.png");
		savedUser = userRepository.save(user);
	}

	@Test
	@DisplayName("UserInfoResponse가 User 엔티티 필드와 일치하는지 검증")
	void testReadUserInfo() {
		// when
		UserInfoResponse response = userService.readUserInfo(savedUser.getUserId());

		// then
		assertEquals(savedUser.getUserId(), response.getUserId());
		assertEquals(savedUser.getNickname(), response.getNickname());
		assertEquals(savedUser.getImageName(), response.getImageName());
		assertEquals(savedUser.getCreatedDate().truncatedTo(ChronoUnit.SECONDS), response.getCreatedAt().truncatedTo(ChronoUnit.SECONDS));
	}
}
