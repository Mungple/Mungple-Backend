package com.e106.mungplace.web.exploration.controller;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import com.e106.mungplace.common.log.impl.ApplicationLogger;
import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.exploration.impl.ExplorationRecorder;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.domain.user.repository.UserRepository;
import com.e106.mungplace.web.exploration.dto.ExplorationResponse;
import com.e106.mungplace.web.exploration.dto.ExplorationStartResponse;
import com.e106.mungplace.web.exploration.dto.ExplorationStartWithDogsRequest;
import com.e106.mungplace.web.exploration.dto.ExplorationStatisticResponse;
import com.e106.mungplace.web.exploration.dto.ExplorationsResponse;
import com.e106.mungplace.web.exploration.service.ExplorationService;
import com.e106.mungplace.web.handler.interceptor.WebSocketSessionManager;
import com.e106.mungplace.web.util.StatisticUtils;
import com.fasterxml.jackson.databind.ObjectMapper;

@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(controllers = ExplorationController.class)
class ExplorationControllerUnitTest {

	@Autowired
	private MockMvc mvc;

	@MockBean
	private ExplorationService explorationService;

	@MockBean
	private ExplorationRecorder explorationRecorder;

	@MockBean
	private UserRepository userRepository;

	@MockBean
	private SimpMessagingTemplate simpMessagingTemplate;

	@MockBean
	private WebSocketSessionManager sessionManager;

	@MockBean
	private ApplicationLogger applicationLogger;

	@Autowired
	private ObjectMapper objectMapper;

	private final List<Long> togetherDogIds = new ArrayList<>();

	private Exploration exploration;

	private int year;
	private int month;

	@BeforeEach
	public void setUp() {
		year = LocalDateTime.now().getYear();
		month = LocalDateTime.now().getMonthValue();

		togetherDogIds.add(1L);
		togetherDogIds.add(2L);

		exploration = new Exploration(1L, new User(1L), LocalDateTime.now());
	}

	@DisplayName("산책 시작 API를 호출하면 201 코드와 적절한 응답이 body에 담겨 온다.")
	@Test
	void When_StartExploration_Then_201AndBody() throws Exception {
		// given

		ExplorationStartResponse response = ExplorationStartResponse.of(exploration);
		ExplorationStartWithDogsRequest isInDog = ExplorationStartWithDogsRequest.builder()
			.lat("50.00000")
			.lon("129.00000")
			.dogIds(togetherDogIds)
			.build();
		String dogsJson = objectMapper.writeValueAsString(isInDog);

		when(explorationService.startExplorationProcess(any(ExplorationStartWithDogsRequest.class))).thenReturn(
			response);

		// when
		ResultActions resultAction = mvc.perform(post("/explorations")
			.characterEncoding("UTF-8")
			.contentType("application/json")
			.content(dogsJson)
		);

		// then
		resultAction.andExpect(status().isCreated())
			.andExpect(content().json(objectMapper.writeValueAsString(response)))
			.andDo(print());
	}

	@DisplayName("특정 년도와 월의 산책 조회 시 200 코드와 적절한 응답이 body에 담겨 온다.")
	@Test
	void When_FindExplorationOfMonth_Then_200AndBody() throws Exception {
		// given
		List<ExplorationResponse> explorationInfos = new ArrayList<>();
		explorationInfos.add(ExplorationResponse.of(exploration, togetherDogIds));

		ExplorationsResponse response = ExplorationsResponse.of(year, month, explorationInfos);

		when(explorationService.findExplorationsOfMonthProcess(year, month)).thenReturn(response);

		// when
		ResultActions resultAction = mvc.perform(get("/explorations")
			.param("year", String.valueOf(year))
			.param("month", String.valueOf(month))
		);

		// then
		resultAction.andExpect(status().isOk())
			.andExpect(content().json(objectMapper.writeValueAsString(response)))
			.andDo(print());
	}

	@DisplayName("특정 일의 산책 조회 시 200 코드와 적절한 응답이 body에 담겨 온다.")
	@Test
	void When_FindExplorationOfDay_Then_200AndBody() throws Exception {
		// given
		List<ExplorationResponse> explorationInfos = new ArrayList<>();
		exploration.end(500L);
		explorationInfos.add(ExplorationResponse.of(exploration, togetherDogIds));

		ExplorationsResponse response = ExplorationsResponse.of(year, month, explorationInfos);

		when(explorationService.findExplorationsOfDayProcess(any(LocalDate.class))).thenReturn(response);

		// when
		ResultActions resultAction = mvc.perform(get("/explorations/days")
			.param("date", "2024-09-17")
		);

		// then
		resultAction.andExpect(status().isOk())
			.andExpect(content().json(objectMapper.writeValueAsString(response)))
			.andDo(print());
	}

	@DisplayName("산책 상세 조회 시 200 코드와 적절한 응답이 body에 담겨 온다.")
	@Test
	void When_FindDetailExploration_Then_200AndBody() throws Exception {
		// given
		ExplorationResponse response = ExplorationResponse.of(exploration, new ArrayList<>());
		when(explorationService.findExplorationProcess(exploration.getId())).thenReturn(response);

		// when
		ResultActions resultAction = mvc.perform(get("/explorations/{explorationId}", exploration.getId().toString()));

		// then
		resultAction.andExpect(status().isOk())
			.andExpect(content().json(objectMapper.writeValueAsString(response)))
			.andDo(print());
	}

	@DisplayName("산책 통계 조회 시 200 코드와 적절한 응답이 body에 담겨 온다.")
	@Test
	void When_FindStatistics_ExplorationOfMonth_Then_200AndBody() throws Exception {
		// given
		List<ExplorationResponse> explorations = new ArrayList<>();
		LocalDateTime yesterday = LocalDateTime.of(year, month, LocalDateTime.now().getDayOfMonth() - 1, 22, 10);

		Exploration exploration1 = new Exploration(2L, new User(1L), yesterday);
		exploration1.end(1000L);

		explorations.add(ExplorationResponse.of(exploration, new ArrayList<>()));
		explorations.add(ExplorationResponse.of(exploration1, new ArrayList<>()));

		ExplorationStatisticResponse response = StatisticUtils.createExplorationStatisticOfMonth(year, month,
			explorations);

		when(explorationService.findExplorationStatisticsProcess(year, month)).thenReturn(response);

		// when
		ResultActions resultAction = mvc.perform(get("/explorations/statistics")
			.param("year", String.valueOf(year))
			.param("month", String.valueOf(month))
		);

		// then
		resultAction.andExpect(status().isOk())
			.andExpect(content().json(objectMapper.writeValueAsString(response)))
			.andDo(print());
	}
}