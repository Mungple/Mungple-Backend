package com.e106.mungplace.web.util;

import static com.e106.mungplace.web.exception.dto.ApplicationError.*;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import com.e106.mungplace.web.exception.ApplicationException;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class RequestDeduplicator {

	private final String VALUE = "IDEMPOTENT";
	private final Integer TIME_LIMIT = 5;

	private final StringRedisTemplate redisTemplate;

	public void isValidIdempotent(List<String> keyElement) {

		String idempotentKey = compactKey(keyElement);
		// Redis에 해당 키가 없으면 set하고, 있으면 중복 요청으로 간주
		Boolean isNotDuplicate = redisTemplate.opsForValue().setIfAbsent(idempotentKey, VALUE, TIME_LIMIT, TimeUnit.SECONDS);

		if (Boolean.FALSE.equals(isNotDuplicate)) {
			throw new ApplicationException(DUPLICATE_REQUEST);
		}
	}

	private String compactKey(List<String> keyElement) {
		return String.join(":", keyElement);
	}
}
