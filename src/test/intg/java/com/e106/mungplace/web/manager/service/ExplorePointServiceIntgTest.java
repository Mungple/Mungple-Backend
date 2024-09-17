package com.e106.mungplace.web.manager.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Random;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.geo.Point;
import org.springframework.test.context.ActiveProfiles;

import net.bytebuddy.utility.RandomString;

import com.e106.mungplace.domain.exploration.entity.ExplorePoint;
import com.e106.mungplace.domain.exploration.repository.ExplorePointRepository;
import com.e106.mungplace.domain.user.entity.ProviderName;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.domain.user.impl.UserHelper;
import com.e106.mungplace.domain.user.repository.UserRepository;

@ActiveProfiles("intg")
@SpringBootTest
class ManagerExplorePointServiceIntgTest {

	@Autowired
	private ManagerExplorePointService explorePointService;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ExplorePointRepository explorePointRepository;

	@MockBean
	private UserHelper userHelper;

	@DisplayName("산책 위치 데이터를 벌크로 생성하면 새로운 산책에 벌크 데이터가 들어간다.")
	@Test
	void When_GenerateBulkExplorePoints_Then_CreateNewExplorationAndInsertData() {
		// given
		User user = generateRandomUser();
		when(userHelper.getCurrentUserId()).thenReturn(user.getUserId());

		List<Point> points = Stream.generate(this::generateRandomPoint).limit(100).toList();

		// when
		Iterable<ExplorePoint> savedPoints = explorePointService.bulkInsertProcess(user.getProviderId(), points);
		Iterable<ExplorePoint> foundPoints = explorePointRepository.findAllById(
			StreamSupport.stream(savedPoints.spliterator(), false).map(ExplorePoint::getId).toList());

		// then
		assertThat(foundPoints).map(ExplorePoint::getId)
			.isNotEmpty()
			.containsAll(StreamSupport.stream(savedPoints.spliterator(), false).map(ExplorePoint::getId).toList())
			.size()
			.isEqualTo(points.size());
	}

	private User generateRandomUser() {
		return userRepository.save(
			new User(RandomString.make(), ProviderName.MANAGER, RandomString.make(), RandomString.make()));
	}

	private Point generateRandomPoint() {
		Random random = new Random(System.currentTimeMillis());
		return new Point(random.nextDouble() * 10, random.nextDouble() * 10);
	}
}