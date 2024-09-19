package com.e106.mungplace.web.user.service;

import java.util.Map;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.domain.user.repository.UserRepository;
import com.e106.mungplace.web.handler.filter.CustomOAuth2User;
import com.e106.mungplace.web.user.dto.GoogleUserInfo;
import com.e106.mungplace.web.user.dto.KakaoUserInfo;
import com.e106.mungplace.web.user.dto.NaverUserInfo;
import com.e106.mungplace.web.user.dto.OAuth2UserInfo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
@Service
public class OAuth2UserService extends DefaultOAuth2UserService {

	private final UserRepository userRepository;

	@Override
	@Transactional
	public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
		OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);

		String oAuth2ClientName = oAuth2UserRequest.getClientRegistration().getRegistrationId();

		OAuth2UserInfo userInfo = getUserInfo(oAuth2ClientName, oAuth2User.getAttributes());
		User user = findOrSaveUser(userInfo);
		return new CustomOAuth2User(user);
	}

	public User findOrSaveUser(OAuth2UserInfo userInfo) {
		return userRepository.findUserByProviderId(userInfo.getProviderId())
			.orElseGet(() -> saveUser(userInfo));
	}

	private User saveUser(OAuth2UserInfo userInfo) {
		User newUser = User.builder()
			.providerId(userInfo.getProviderId())
			.providerName(userInfo.getProviderName())
			.nickname(userInfo.getNickname())
			.build();

		userRepository.save(newUser);
		return newUser;
	}

	public static OAuth2UserInfo getUserInfo(String registrationId, Map<String, Object> attributes) {
		attributes.forEach((key, value) -> log.debug("{}: {}", key, value));

		return switch (registrationId) {
			case "google" -> new GoogleUserInfo(attributes);
			case "kakao" -> new KakaoUserInfo(attributes);
			case "naver" -> new NaverUserInfo(attributes);
			default -> throw new IllegalArgumentException("Unsupported provider " + registrationId);
		};
	}
}