package com.e106.mungplace.web.exploration.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.stream.Stream;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import com.e106.mungplace.common.map.dto.Point;
import com.e106.mungplace.domain.user.repository.UserRepository;
import com.e106.mungplace.web.manager.controller.ExplorePointBulkController;
import com.e106.mungplace.web.manager.dto.ManagerExplorePointCreateRequest;
import com.e106.mungplace.web.manager.service.ManagerExplorePointService;
import com.fasterxml.jackson.databind.ObjectMapper;

@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(ExplorePointBulkController.class)
class ExplorePointBulkControllerUnitTest {

	@Autowired
	private MockMvc mvc;

	@Autowired
	private ObjectMapper objectMapper;

	@MockBean
	private UserRepository userRepository;

	@MockBean
	private ManagerExplorePointService explorePointService;

	@DisplayName("Point 목록을 전달하면 산책 위치 데이터를 삽입한다.")
	@Test
	void insertBulkExplorePoint() throws Exception {
		// given
		String managerName = "manager";
		List<Point> points = Stream.generate(this::generateRandomPoint).limit(100).toList();
		String requestBody = objectMapper.writeValueAsString(new ManagerExplorePointCreateRequest(managerName, points));

		// when
		ResultActions actions = mvc.perform(post("/manager/explorations")
			.contentType(MediaType.APPLICATION_JSON)
			.content(requestBody));

		// then
		actions.andExpect(status().isCreated());

	}

	private Point generateRandomPoint() {
		Random random = new Random();
		return new Point(random.nextDouble() * 10, random.nextDouble() * 10);
	}
}