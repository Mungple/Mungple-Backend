package com.e106.mungplace.web.handler.filter;

import java.io.IOException;
import org.springframework.web.filter.OncePerRequestFilter;
import com.e106.mungplace.web.util.JwtAuthenticationHelper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JwtAuthProcessFilter extends OncePerRequestFilter {

	private final JwtAuthenticationHelper helper;

	@Override
	public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
		throws ServletException, IOException {

		String authorizationHeader = request.getHeader("Authorization");

		if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
			String token = authorizationHeader.substring(7);
			helper.storeAuthenticationInContext(token);
		}

		filterChain.doFilter(request, response);
	}
}
