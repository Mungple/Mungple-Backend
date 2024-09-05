package com.e106.mungplace.web.filter;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.web.user.dto.LoginResponse;
import com.e106.mungplace.web.util.JwtProvider;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

	private final JwtProvider jwtProvider;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {

		CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
		User user = oAuth2User.getUser();

		LoginResponse loginResponse = jwtProvider.generateTokens(user.getUserId(), user.getImageName(), user.getNickname());

		response.setHeader("Authorization", "Bearer " + loginResponse.accessToken());
	}
}