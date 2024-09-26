package com.e106.mungplace.domain.dogexploration.repository;

import static org.assertj.core.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import net.bytebuddy.utility.RandomString;

import com.e106.mungplace.domain.dogs.entity.Dog;
import com.e106.mungplace.domain.dogs.entity.Gender;
import com.e106.mungplace.domain.dogs.repository.DogRepository;
import com.e106.mungplace.domain.exploration.entity.DogExploration;
import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.exploration.repository.DogExplorationRepository;
import com.e106.mungplace.domain.exploration.repository.ExplorationRepository;
import com.e106.mungplace.domain.user.entity.ProviderName;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.domain.user.repository.UserRepository;

@DataJpaTest
public class DogExplorationRepositoryTest {

	@Autowired
	private DogRepository dogRepository;

	@Autowired
	private DogExplorationRepository dogExplorationRepository;

	@Autowired
	private ExplorationRepository explorationRepository;

	@Autowired
	private UserRepository userRepository;

	private User user;
	private Dog dog1;
	private Dog dog2;

	@BeforeEach
	void setUp() {
		createUser();
		createDogs();
	}

	@DisplayName("산책 ID를 통해 애견산책 정보를 조회한다.")
	@Test
	void Find_DogExploration_From_ExplorationId() {
		// given
		Exploration exploration = new Exploration(user, LocalDateTime.now());
		explorationRepository.save(exploration);

		DogExploration dogExploration1 = DogExploration.builder()
			.dog(dog1)
			.exploration(exploration)
			.isEnded(false)
			.build();
		DogExploration dogExploration2 = DogExploration.builder()
			.dog(dog2)
			.exploration(exploration)
			.isEnded(false)
			.build();
		dogExplorationRepository.save(dogExploration1);
		dogExplorationRepository.save(dogExploration2);

		// when
		List<DogExploration> dogExplorations = dogExplorationRepository.findDogExplorationsByExplorationId(
			exploration.getId());

		// then
		assertThat(dogExplorations).isNotNull();
		assertThat(dogExplorations).hasSize(2);
		assertThat(dogExplorations.get(0).isEnded()).isFalse();
	}

	private void createUser() {
		user = new User(RandomString.make(), ProviderName.NAVER, RandomString.make(), RandomString.make());
		userRepository.save(user);
	}

	private void createDogs() {
		dog1 = Dog.builder()
			.user(user)
			.dogName("멍멍이1")
			.birth(new Date())
			.gender(Gender.MALE)
			.weight(30)
			.isDefault(true)
			.build();
		dog2 = Dog.builder()
			.user(user)
			.dogName("멍멍이2")
			.birth(new Date())
			.gender(Gender.FEMALE)
			.weight(25)
			.isDefault(false)
			.build();

		dogRepository.save(dog1);
		dogRepository.save(dog2);
	}
}
