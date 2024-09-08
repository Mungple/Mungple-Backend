package com.e106.mungplace.web.exploration.controller;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDateTime;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.domain.user.repository.UserRepository;
import com.e106.mungplace.web.exploration.dto.ExplorationStartResponse;
import com.e106.mungplace.web.exploration.service.ExplorationService;
import com.fasterxml.jackson.databind.ObjectMapper;

@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(controllers = ExplorationController.class)
class ExplorationControllerUnitTest {

	@Autowired
	private MockMvc mvc;

	@MockBean
	private ExplorationService explorationService;

	@MockBean
	private UserRepository userRepository;

	@Autowired
	private ObjectMapper objectMapper;

	@DisplayName("산책 시작 API를 호출하면 201 코드와 적절한 응답이 body에 담겨 온다.")
	@Test
	void When_StartExploration_Then_201AndBody() throws Exception {
		// given
		Exploration exploration = new Exploration(new User(1L), LocalDateTime.now());
		ExplorationStartResponse response = ExplorationStartResponse.of(exploration);
		when(explorationService.startExplorationProcess()).thenReturn(response);

		// when
		ResultActions resultAction = mvc.perform(post("/explorations"));

		// then
		resultAction.andExpect(status().isCreated())
			.andExpect(content().json(objectMapper.writeValueAsString(response)))
			.andDo(print());
	}
}