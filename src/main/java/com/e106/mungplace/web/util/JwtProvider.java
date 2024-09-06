package com.e106.mungplace.web.util;

import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.domain.user.repository.UserRepository;
import com.e106.mungplace.web.user.dto.LoginResponse;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class JwtProvider {

	private static final String ISSUER = "Mungplace";

	@Value("${jwt.secret-key}")
	private String secretKey;

	@Value("${jwt.access-token-expire-time}")
	private Long accessTokenExpireTime;

	@Value("${jwt.refresh-token-expire-time}")
	private Long refreshTokenExpireTime;

	private final UserRepository userRepository;

	public String createAccessToken(Long userId) {
		Date now = new Date();
		return JWT.create()
			.withIssuer(ISSUER)
			.withSubject("AccessToken")
			.withExpiresAt(new Date(now.getTime() + accessTokenExpireTime))
			.withClaim("userId", userId)
			.sign(Algorithm.HMAC512(secretKey));
	}

	public String createRefreshToken() {
		Date now = new Date();
		return JWT.create()
			.withIssuer(ISSUER)
			.withJWTId(UUID.randomUUID().toString())
			.withExpiresAt(new Date(now.getTime() + refreshTokenExpireTime))
			.sign(Algorithm.HMAC512(secretKey));
	}

	public boolean verifyToken(String token) {
		try {
			Algorithm algorithm = Algorithm.HMAC512(secretKey);
			JWTVerifier verifier = JWT.require(algorithm)
				.withIssuer(ISSUER)
				.build();
			verifier.verify(token);
			return true;
		} catch (JWTVerificationException e) {
			return false;
		}
	}

	@Transactional
	public LoginResponse generateTokens(Long userId, String profileImageUrl, String nickName) {
		String accessToken = createAccessToken(userId);
		String refreshToken = createRefreshToken();
		updateRefreshToken(userId, refreshToken);

		return LoginResponse.builder()
			.accessToken(accessToken)
			.refreshToken(refreshToken)
			.build();
	}

	public void updateRefreshToken(Long userId, String refreshToken) {
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new IllegalArgumentException("No member found"));
		// user.setRefreshToken(refreshToken); 추후 reIssue 구현 시 Redis 저장으로 수정
		userRepository.save(user);
	}

	public Long extractUserIdFromToken(String token) {
		try {
			DecodedJWT jwt = JWT.decode(token);
			return jwt.getClaim("userId").asLong();
		} catch (Exception e) {
			throw new IllegalArgumentException("Invalid token");
		}
	}
}