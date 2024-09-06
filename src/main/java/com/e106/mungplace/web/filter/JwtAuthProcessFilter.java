package com.e106.mungplace.web.filter;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import com.e106.mungplace.domain.user.repository.UserRepository;
import com.e106.mungplace.web.util.JwtProvider;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JwtAuthProcessFilter extends OncePerRequestFilter {

	private final JwtProvider jwtProvider;
	private final UserRepository userRepository;

	@Override
	public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
		throws ServletException, IOException {

		String authorizationHeader = request.getHeader("Authorization");

		if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
			String token = authorizationHeader.substring(7);

			if (jwtProvider.verifyToken(token)) {
				Long userId = jwtProvider.extractUserIdFromToken(token);

				UserDetails user = User.builder()
					.username(userId.toString())
					.password("")
					.authorities(List.of())
					.build();

				Authentication authentication = new UsernamePasswordAuthenticationToken(
					user, "", user.getAuthorities());

				SecurityContextHolder.getContext().setAuthentication(authentication);
			}
		}
		filterChain.doFilter(request, response);
	}
}
