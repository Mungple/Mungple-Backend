package com.e106.mungplace.redis;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.context.ActiveProfiles;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@ActiveProfiles("intg")
@SpringBootTest
class RedisIntgTest {

	@Autowired
	private RedisTemplate<String, Object> redisTemplate;
	private ValueOperations<String, Object> valueOps;

	@BeforeEach
	public void setUp() {
		valueOps = redisTemplate.opsForValue();
	}

	@Test
	void testSaveAndRetrieveJsonObject() {
		// 객체 생성
		User user = new User("1", "John Doe", 30);

		// Redis에 객체 저장 (직렬화 시 JSON 사용)
		String key = "user:1";
		valueOps.set(key, user);

		// Redis에서 객체 읽어오기
		User fetchedUser = (User)valueOps.get(key);

		// 검증
		assertThat(fetchedUser).isNotNull();
		assertThat(fetchedUser.getId()).isEqualTo(user.getId());
		assertThat(fetchedUser.getName()).isEqualTo(user.getName());
		assertThat(fetchedUser.getAge()).isEqualTo(user.getAge());
	}

	@AllArgsConstructor
	@NoArgsConstructor
	@Setter
	@Getter
	static class User {

		private String id;
		private String name;
		private int age;
	}
}