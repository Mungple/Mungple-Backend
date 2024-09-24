package com.e106.mungplace.web.handler.filter;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.web.util.JwtAuthenticationHelper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

	private final JwtAuthenticationHelper jwtAuthenticationHelper;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws
		IOException {

		CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
		User user = oAuth2User.getUser();

		String accessToken = jwtAuthenticationHelper.createAccessToken(user.getUserId());
		// TODO: <홍성우> 프로튼와 합의해서 변경 임시
		String redirectUrl = "http://localhost:8080" + "/auth/oauth-response";
		response.setHeader("Authorization", "Bearer " + accessToken);
		response.sendRedirect(redirectUrl);

	}
}