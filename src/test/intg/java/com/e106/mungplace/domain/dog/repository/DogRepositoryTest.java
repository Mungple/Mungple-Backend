package com.e106.mungplace.domain.dog.repository;

import static org.assertj.core.api.Assertions.*;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import com.e106.mungplace.domain.dogs.entity.Dog;
import com.e106.mungplace.domain.dogs.entity.Gender;
import com.e106.mungplace.domain.dogs.repository.DogRepository;
import com.e106.mungplace.domain.user.entity.ProviderName;
import com.e106.mungplace.domain.user.entity.User;

@DataJpaTest
class DogRepositoryTest {

	@Autowired
	private TestEntityManager entityManager;

	@Autowired
	private DogRepository dogRepository;

	private User user;

	@BeforeEach
	public void setUp() {
		user = User.builder()
			.imageName("testImage.jpg")
			.nickname("Tester")
			.providerName(ProviderName.GOOGLE)
			.providerId("testProviderId123")
			.build();
		entityManager.persist(user);

		Dog dog1 = Dog.builder()
			.user(user)
			.dogName("멍멍이1")
			.birth(LocalDate.now())
			.gender(Gender.MALE)
			.weight(30)
			.imageName("image1.png")
			.isDefault(true)
			.build();

		Dog dog2 = Dog.builder()
			.user(user)
			.dogName("멍멍이2")
			.birth(LocalDate.now())
			.gender(Gender.FEMALE)
			.weight(25)
			.imageName("image2.png")
			.isDefault(false)
			.build();

		entityManager.persist(dog1);
		entityManager.persist(dog2);

		entityManager.flush();
	}

	@Test
	void testFindByUserUserId() {
		List<Dog> dogs = dogRepository.findByUserUserId(user.getUserId());
		assertThat(dogs).hasSize(2);
		assertThat(dogs.get(0).getDogName()).isEqualTo("멍멍이1");
		assertThat(dogs.get(1).getDogName()).isEqualTo("멍멍이2");
	}

	@Test
	void testCountDogsByUserUserId() {
		int count = dogRepository.countDogsByUserUserId(user.getUserId());
		assertThat(count).isEqualTo(2);
	}
}
