package com.e106.mungplace.web.handler.interceptor;

import java.util.List;
import java.util.Map;
import java.util.stream.StreamSupport;

import org.apache.kafka.clients.consumer.ConsumerInterceptor;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.OffsetAndMetadata;
import org.apache.kafka.common.TopicPartition;

import com.e106.mungplace.common.log.dto.EventCommitLog;
import com.e106.mungplace.common.log.dto.EventConsumeLog;
import com.e106.mungplace.common.log.dto.LogAction;
import com.e106.mungplace.common.log.dto.LogLevel;
import com.e106.mungplace.common.log.impl.ApplicationLogger;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

public class KafkaConsumerInterceptor implements ConsumerInterceptor<String, Object> {

	private final ApplicationLogger logger;

	public KafkaConsumerInterceptor() {
		logger = new ApplicationLogger(new ObjectMapper().registerModule(new JavaTimeModule()));
	}

	@Override
	public ConsumerRecords<String, Object> onConsume(ConsumerRecords<String, Object> consumerRecords) {
		List<String> topics = consumerRecords.partitions().stream().map(TopicPartition::topic).toList();
		List<Object> values = consumerRecords.partitions()
			.stream()
			.map(TopicPartition::topic)
			.map(consumerRecords::records)
			.flatMap(records -> StreamSupport.stream(records.spliterator(), false))
			.map(ConsumerRecord::value)
			.toList();

		EventConsumeLog log = new EventConsumeLog(topics, values);

		logger.log(LogLevel.TRACE, LogAction.CONSUME, log, getClass());

		return consumerRecords;
	}

	@Override
	public void onCommit(Map<TopicPartition, OffsetAndMetadata> map) {
		List<String> topics = map.keySet().stream()
			.map(TopicPartition::topic)
			.toList();
		List<Long> offsets = map.values().stream()
			.map(OffsetAndMetadata::offset)
			.toList();

		EventCommitLog log = new EventCommitLog(topics, offsets);

		logger.log(LogLevel.TRACE, LogAction.COMMIT, log, getClass());
	}

	@Override
	public void close() {

	}

	@Override
	public void configure(Map<String, ?> map) {

	}
}
