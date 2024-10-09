package com.e106.mungplace.common.config;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.config.TopicConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.listener.ContainerProperties;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.support.serializer.JsonSerializer;
import org.springframework.util.backoff.BackOff;
import org.springframework.util.backoff.ExponentialBackOff;

import com.e106.mungplace.web.handler.interceptor.KafkaConsumerInterceptor;
import com.e106.mungplace.web.handler.interceptor.KafkaProducerInterceptor;

@Configuration
public class KafkaConfig {

	@Bean
	@Primary
	@ConfigurationProperties("spring.kafka")
	public KafkaProperties kafkaProperties() {
		return new KafkaProperties();
	}

	@Bean
	@Primary
	public ConcurrentKafkaListenerContainerFactory<String, Object> kafkaListenerContainerFactory(
		ConsumerFactory<String, Object> consumerFactory,
		KafkaTemplate<String, Object> kafkaTemplate
	) {
		ConcurrentKafkaListenerContainerFactory<String, Object> factory = new ConcurrentKafkaListenerContainerFactory<>();
		factory.setConsumerFactory(consumerFactory);
		factory.setCommonErrorHandler(
			new DefaultErrorHandler(new DeadLetterPublishingRecoverer(kafkaTemplate), generatedBackoff()));
		factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.MANUAL);
		return factory;
	}

	@Bean
	@Primary
	public ConsumerFactory<String, Object> consumerFactory(KafkaProperties kafkaProperties) {
		Map<String, Object> props = new HashMap<>();

		props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaProperties.getBootstrapServers());
		props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
		props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
		props.put(JsonDeserializer.TRUSTED_PACKAGES, "*");
		props.put(JsonDeserializer.USE_TYPE_INFO_HEADERS, true);
		props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "latest");
		props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "false");
		props.put(ConsumerConfig.INTERCEPTOR_CLASSES_CONFIG, KafkaConsumerInterceptor.class.getName());
		return new DefaultKafkaConsumerFactory<>(props);
	}

	@Bean
	@Primary
	public ProducerFactory<String, Object> producerFactory(KafkaProperties kafkaProperties) {
		Map<String, Object> props = new HashMap<>();
		props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaProperties.getBootstrapServers());
		props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
		props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
		props.put(ProducerConfig.ACKS_CONFIG, kafkaProperties.getProducer().getAcks());
		props.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, "true");
		props.put(JsonSerializer.ADD_TYPE_INFO_HEADERS, true);

		return new DefaultKafkaProducerFactory<>(props);
	}

	@Bean
	@Primary
	public KafkaTemplate<String, ?> kafkaTemplate(KafkaProperties kafkaProperties,
		KafkaProducerInterceptor producerInterceptor) {
		KafkaTemplate<String, Object> kafkaTemplate = new KafkaTemplate<>(producerFactory(kafkaProperties));
		kafkaTemplate.setProducerInterceptor(producerInterceptor);
		return kafkaTemplate;
	}

	@Bean
	public NewTopic tempTopic() {
		return TopicBuilder.name("temp")
			.partitions(3)
			.replicas(2)
			.config(TopicConfig.RETENTION_MS_CONFIG, String.valueOf(7 * 24 * 60 * 60))
			.build();
	}

	@Bean
	public NewTopic markerTopic() {
		return TopicBuilder.name("marker")
			.partitions(3)
			.replicas(2)
			.config(TopicConfig.RETENTION_MS_CONFIG, String.valueOf(7 * 24 * 60 * 60))
			.build();
	}

	@Bean
	public NewTopic explorationTopic() {
		return TopicBuilder.name("exploration")
			.partitions(3)
			.replicas(2)
			.config(TopicConfig.RETENTION_MS_CONFIG, String.valueOf(7 * 24 * 60 * 60))
			.build();
	}

	@Bean
	public NewTopic heatMapTopic() {
		return TopicBuilder.name("heatmap")
			.partitions(6)
			.replicas(2)
			.config(TopicConfig.RETENTION_MS_CONFIG, String.valueOf(7 * 24 * 60 * 60))
			.build();
	}

	@Bean
	public NewTopic mungpleTopic() {
		return TopicBuilder.name("mungple")
			.partitions(3)
			.replicas(2)
			.config(TopicConfig.RETENTION_MS_CONFIG, String.valueOf(7 * 24 * 60 * 60))
			.build();
	}

	@Bean
	public NewTopic accessLogTopic() {
		return TopicBuilder.name("access-log")
			.partitions(3)
			.replicas(2)
			.config(TopicConfig.RETENTION_MS_CONFIG, String.valueOf(7 * 24 * 60 * 60))
			.build();
	}

	@Bean
	public NewTopic markerSaveFailureTopic() {
		return TopicBuilder.name("markerSaveFailure")
			.partitions(3)
			.replicas(1)
			.config(TopicConfig.RETENTION_MS_CONFIG, String.valueOf(7 * 24 * 60 * 60))
			.build();
	}

	private BackOff generatedBackoff() {
		ExponentialBackOff backOff = new ExponentialBackOff(1000L, 2L);
		backOff.setMaxElapsedTime(10000L);

		return backOff;
	}
}
