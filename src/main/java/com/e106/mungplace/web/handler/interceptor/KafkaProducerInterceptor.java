package com.e106.mungplace.web.handler.interceptor;

import java.util.Map;

import org.apache.kafka.clients.producer.ProducerInterceptor;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.apache.kafka.common.errors.RecordTooLargeException;
import org.springframework.stereotype.Component;

import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exception.dto.ApplicationError;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class KafkaProducerInterceptor implements ProducerInterceptor<String, Object> {
	@Override
	public ProducerRecord<String, Object> onSend(ProducerRecord<String, Object> producerRecord) {
		log.info("[Attempt] Topic : {}, Key : {}", producerRecord.topic(), producerRecord.key());
		return producerRecord;
	}

	@Override
	public void onAcknowledgement(RecordMetadata recordMetadata, Exception e) {
		if (e == null) {
			log.info("[Success] Topic : {}, Partition : {}", recordMetadata.topic(), recordMetadata.partition());
		} else {
			handleException(e);
		}
	}

	private void handleException(Exception e) {
		if (e instanceof RecordTooLargeException) {
			log.error("[Fatal Error] Record is too Large, Message : {}", e.getMessage());
			throw new ApplicationException(ApplicationError.RECORD_IS_TOO_LARGE);
		} else {
			log.error("[Failure] Message Produce Failed, Message : {}", e.getMessage());
			throw new ApplicationException(ApplicationError.EVENT_PRODUCE_FAILED);
		}
	}

	@Override
	public void close() {

	}

	@Override
	public void configure(Map<String, ?> map) {

	}
}
