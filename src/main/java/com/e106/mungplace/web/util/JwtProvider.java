package com.e106.mungplace.web.util;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.e106.mungplace.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class JwtProvider {

	private static final String ISSUER = "Mungplace";

	@Value("${jwt.secret-key}")
	private String secretKey;

	@Value("${jwt.access-token-expire-time}")
	private Long accessTokenExpireTime;

	private final UserRepository userRepository;

	public String createAccessToken(Long userId) {
		Date now = new Date();
		return JWT.create()
			.withIssuer(ISSUER)
			.withExpiresAt(new Date(now.getTime() + accessTokenExpireTime))
			.withClaim("userId", userId)
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

	public Long extractUserIdFromToken(String token) {
		try {
			DecodedJWT jwt = JWT.decode(token);
			return jwt.getClaim("userId").asLong();
		} catch (Exception e) {
			throw new IllegalArgumentException("Invalid token");
		}
	}
}