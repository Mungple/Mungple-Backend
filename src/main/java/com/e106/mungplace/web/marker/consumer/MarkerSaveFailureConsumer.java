package com.e106.mungplace.web.marker.consumer;

import java.util.List;
import java.util.UUID;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

import com.e106.mungplace.common.image.ImageManager;
import com.e106.mungplace.domain.image.entity.ImageInfo;
import com.e106.mungplace.domain.image.repository.MarkerImageInfoRepository;
import com.e106.mungplace.domain.marker.repository.MarkerRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class MarkerSaveFailureConsumer {

	public final String topic;

	private final MarkerRepository markerRepository;

	private final ImageManager imageManager;

	private final MarkerImageInfoRepository markerImageInfoRepository;

	public MarkerSaveFailureConsumer(NewTopic markerSaveFailureTopic, MarkerRepository markerRepository, ImageManager imageManager,
		MarkerImageInfoRepository markerImageInfoRepository) {
		this.topic = markerSaveFailureTopic.name();
		this.markerRepository = markerRepository;
		this.imageManager = imageManager;
		this.markerImageInfoRepository = markerImageInfoRepository;
	}

	@KafkaListener(topics = "#{__listener.topic}", groupId = "#{__listener.topic}-create-group")
	public void rollbackMarkerEvent(String markerId, Acknowledgment ack) {
		UUID markerUUID = UUID.fromString(markerId);

		List<ImageInfo> images = markerImageInfoRepository.findByMarkerId(markerUUID);
		if (!images.isEmpty()) {
			images.forEach(image -> {
				imageManager.deleteImage(image.getImageName());
				markerImageInfoRepository.delete(image);
			});
		}

		markerRepository.deleteById(markerUUID);

		ack.acknowledge();
		log.info("[{}] Consume Success - ID : {} ", topic.toUpperCase(), markerUUID);
	}
}
