package com.e106.mungplace.domain.exploration.repository;

import static org.assertj.core.api.Assertions.*;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import net.bytebuddy.utility.RandomString;

import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.user.entity.ProviderName;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.domain.user.repository.UserRepository;

@DataJpaTest
class ExplorationRepositoryTest {

	@Autowired
	private ExplorationRepository explorationRepository;

	@Autowired
	private UserRepository userRepository;

	private User user;
	private LocalDateTime now;
	private YearMonth yearMonth;
	private LocalDateTime startDate;
	private LocalDateTime endDate;

	@BeforeEach
	void setUp() {
		// Initialize common test data
		user = new User(RandomString.make(), ProviderName.NAVER, RandomString.make(), RandomString.make());
		userRepository.save(user);

		now = LocalDateTime.now();
		yearMonth = YearMonth.of(now.getYear(), now.getMonth());
		startDate = yearMonth.atDay(1).atStartOfDay();
		endDate = yearMonth.atEndOfMonth().atTime(23, 59, 59, 999999999);
	}

	@DisplayName("EndAt이 null인 산책이 있는지 조회한다.")
	@Test
	void When_CheckUsersEndAtNullData_Then_ReturnTrue() {
		// given
		Exploration exploration = new Exploration(user, LocalDateTime.now());
		explorationRepository.save(exploration);

		// when
		boolean isExists = explorationRepository.existsByUserAndEndAtIsNull(user);

		// then
		assertThat(isExists).isTrue();
	}

	@DisplayName("특정 년월의 산책 목록을 조회한다.")
	@Test
	void When_FindExplorationsSpecificYearMonth_Then_ReturnBody() {
		// given
		Exploration exploration = new Exploration(user, now);
		exploration.end(100L);
		explorationRepository.save(exploration);

		// when
		List<Exploration> response = explorationRepository.findByUserIdAndStartAtBetween(user.getUserId(), startDate, endDate);

		// then
		assertThat(response).hasSize(1);
	}

	@DisplayName("특정 년월의 산책을 조회 시 종료되지 않은 산책은 제외된다.")
	@Test
	void When_FindExploration_Not_Included() {
		// given
		Exploration finishedExploration = new Exploration(user, now);
		finishedExploration.end(100L);
		explorationRepository.save(finishedExploration);

		Exploration ongoingExploration = new Exploration(user, now);
		explorationRepository.save(ongoingExploration);

		// when
		List<Exploration> response = explorationRepository.findByUserIdAndStartAtBetween(user.getUserId(), startDate, endDate);

		// then
		assertThat(response).hasSize(1);
	}
}