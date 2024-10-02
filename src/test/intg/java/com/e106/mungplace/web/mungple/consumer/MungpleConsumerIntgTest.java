package com.e106.mungplace.web.mungple.consumer;

import static org.assertj.core.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.e106.mungplace.common.map.dto.Point;
import com.e106.mungplace.domain.exploration.entity.ExplorationEvent;
import com.e106.mungplace.web.exploration.dto.ExplorationPayload;
import com.e106.mungplace.web.mungple.producer.MungpleProducer;

@EnableKafka
@ExtendWith(SpringExtension.class)
@ActiveProfiles("intg")
@SpringBootTest
@EmbeddedKafka(partitions = 1, topics = { "test-topic" })
public class MungpleConsumerIntgTest {
	private static final String TOPIC = "test-topic";

	@Autowired
	private RedisTemplate<String, String> redisTemplate;

	@Autowired
	private KafkaTemplate<String, ExplorationEvent> kafkaTemplate;

	@Autowired
	private MungpleConsumer mungpleConsumer;

	@MockBean
	private MungpleProducer mungpleProducer;

	@BeforeEach
	void setUp() {
		redisTemplate.getConnectionFactory().getConnection().flushAll();
	}

	@Test
	void testMungpleConsumer_withValidEvent() throws Exception {
		// Given
		// 포인트 생성
		Point point = new Point(37.5665, 126.9780);
		LocalDateTime recordedAt = LocalDateTime.now();

		// Creating ExplorationPayload
		ExplorationPayload payload = ExplorationPayload.builder()
			.point(point)
			.recordedAt(recordedAt)
			.build();

		// Creating ExplorationEvent
		ExplorationEvent event = ExplorationEvent.builder()
			.payload(payload)
			.entityType("exploration")
			.userId(1L)
			.publishedAt(LocalDateTime.now())
			.explorationId(1L)
			.build();

		// When
		kafkaTemplate.send(TOPIC, event);

		TimeUnit.SECONDS.sleep(10);

		// Then
		String userGeoHashKey = "users:1:mungple:geohash";
		String geoHash = redisTemplate.opsForValue().get(userGeoHashKey);

		// assertThat(geoHash).isNotNull();
		assertThat(redisTemplate.opsForValue().get("geohash:" + geoHash)).isEqualTo("1");
	}


	// @Test
	// void testMungpleRemoval_whenUserCountFallsBelowThreshold() throws Exception {
	// 	// Given
	// 	String geoHash = "u4pruydqqvj";
	// 	redisTemplate.opsForValue().set("geohash:" + geoHash, "2");
	//
	// 	ExplorationEvent event = new ExplorationEvent("user1",
	// 		new Point(37.5665, 126.9780), LocalDateTime.now());
	//
	// 	// When
	// 	kafkaTemplate.send(TOPIC, event);
	//
	// 	// Wait for the Kafka consumer to process the event
	// 	TimeUnit.SECONDS.sleep(2);
	//
	// 	// Then
	// 	assertThat(redisTemplate.hasKey("mungple:" + geoHash)).isTrue();
	// }
}
