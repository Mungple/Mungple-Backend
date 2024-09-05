package com.e106.mungplace.web.config;

import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.e106.mungplace.domain.user.repository.UserRepository;
import com.e106.mungplace.web.filter.JwtAuthProcessFilter;
import com.e106.mungplace.web.filter.OAuth2FailureHandler;
import com.e106.mungplace.web.filter.OAuth2SuccessHandler;
import com.e106.mungplace.web.user.service.OAuth2UserService;
import com.e106.mungplace.web.util.JwtProvider;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private static final String[] AUTH_WHITELIST = {
		"/api/users/login/*",
		"/oauth2/callback/*"
	};

	@Bean
	public JwtAuthProcessFilter jwtAuthProcessFilter(JwtProvider jwtProvider, UserRepository userRepository) {
		return new JwtAuthProcessFilter(jwtProvider, userRepository);
	}

	@Bean
	public WebSecurityCustomizer webSecurityCustomizer() {
		return web -> web
			.ignoring()
			.requestMatchers("/ws/**", "/sub/**", "/pub/**")
			.requestMatchers(PathRequest.toH2Console());
	}

	@Bean
	public SecurityFilterChain securityFilterChain(
		HttpSecurity http,
		AuthenticationEntryPoint authenticationEntryPoint,
		OAuth2UserService oAuth2UserService,
		OAuth2SuccessHandler oAuth2SuccessHandler,
		OAuth2FailureHandler oAuth2FailureHandler,
		CorsConfig corsConfig,
		JwtProvider jwtProvider,
		UserRepository userRepository
	) throws Exception {
		return http
			.csrf(AbstractHttpConfigurer::disable)
			.headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable))
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.formLogin(AbstractHttpConfigurer::disable)
			.httpBasic(AbstractHttpConfigurer::disable)
			.addFilterBefore(new JwtAuthProcessFilter(jwtProvider, userRepository), UsernamePasswordAuthenticationFilter.class)
			.authorizeHttpRequests(request -> request
				.requestMatchers(AUTH_WHITELIST).permitAll()
				.anyRequest().authenticated())
			.exceptionHandling((exceptionHandling) -> exceptionHandling
				.authenticationEntryPoint(authenticationEntryPoint)
			)
			.oauth2Login(oauth2 -> oauth2
				.authorizationEndpoint(endpoint ->
					endpoint.baseUri("/api/users/login"))
				.redirectionEndpoint(endpoint ->
					endpoint.baseUri("/oauth2/callback/*")
				).userInfoEndpoint(endpoint ->
					endpoint.userService(oAuth2UserService))
				.successHandler(oAuth2SuccessHandler)
				.failureHandler(oAuth2FailureHandler))
			.addFilter(corsConfig.corsFilter())
			.build();
	}
}