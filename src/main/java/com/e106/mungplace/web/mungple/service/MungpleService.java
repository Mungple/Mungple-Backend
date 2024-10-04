package com.e106.mungplace.web.mungple.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.e106.mungplace.common.map.dto.Point;
import com.e106.mungplace.domain.util.GeoUtils;
import com.e106.mungplace.web.mungple.dto.MungpleRequest;

import ch.hsr.geohash.GeoHash;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class MungpleService {

	private final RedisTemplate<String, String> redisTemplate;

	private final SimpMessagingTemplate messagingTemplate;

	// 특정 사용자에게 Mungple 데이터를 전송
	public void sendMungpleToUser(MungpleRequest mungpleRequest, Long userId) {

		String destination = "/sub/mungple";
		Point point = mungpleRequest.point();
		String geohash = Point.toMungpleGeoHash(point.lat().toString(), point.lon().toString());

		List<Point> mungpleData = getNearbyMungplesSpiral(geohash, 4);

		// WebSocket을 통해 사용자에게 Mungple 데이터 전송
		messagingTemplate.convertAndSendToUser(userId.toString(), destination, mungpleData);
	}

	// 달팽이 모양으로 주변 GeoHash를 탐색
	public List<Point> getNearbyMungplesSpiral(String currentGeoHash, int numOfSteps) {
		List<Point> nearbyMungples = new ArrayList<>();
		Set<String> visited = new HashSet<>();

		// 중심 위치 추가
		GeoHash centerGeoHash = GeoHash.fromGeohashString(currentGeoHash);
		visited.add(currentGeoHash);

		if (isMungpleCreated(currentGeoHash)) {
			Point point = GeoUtils.calculateGeohashCenterPoint(currentGeoHash);
			nearbyMungples.add(point);
		}

		GeoHash currentGeoHashPointer = centerGeoHash;
		int directionIndex = 0;
		boolean increaseSteps = false;
		int steps = 1;

		// 달팽이 모양 탐색 시작
		while (steps <= numOfSteps) {
			for (int i = 0; i < steps; i++) {
				// 방향에 따른 이동
				currentGeoHashPointer = getAdjacentGeoHash(currentGeoHashPointer, directionIndex);
				String newGeoHashStr = currentGeoHashPointer.toBase32();

				// 방문 여부 및 Mungple 탐색 통합
				if (visited.add(newGeoHashStr)) {
					if (isMungpleCreated(newGeoHashStr)) {
						Point point = GeoUtils.calculateGeohashCenterPoint(newGeoHashStr);
						nearbyMungples.add(point);
					}
				}
			}

			directionIndex = (directionIndex + 1) % 4;

			if (increaseSteps) {
				steps++;
			}
			increaseSteps = !increaseSteps;
		}

		for (int i = 0; i < steps - 1; i++) {
			currentGeoHashPointer = getAdjacentGeoHash(currentGeoHashPointer, directionIndex);
			String newGeoHashStr = currentGeoHashPointer.toBase32();

			if (visited.add(newGeoHashStr)) {
				if (isMungpleCreated(newGeoHashStr)) {
					Point point = GeoUtils.calculateGeohashCenterPoint(newGeoHashStr);
					nearbyMungples.add(point);
				}
			}
		}

		return nearbyMungples;
	}

	// 주어진 방향에 따른 이웃 GeoHash 반환
	private GeoHash getAdjacentGeoHash(GeoHash currentGeoHash, int directionIndex) {
		switch (directionIndex) {
			case 0:
				return currentGeoHash.getEasternNeighbour();
			case 1:
				return currentGeoHash.getSouthernNeighbour();
			case 2:
				return currentGeoHash.getWesternNeighbour();
			case 3:
				return currentGeoHash.getNorthernNeighbour();
			default:
				throw new RuntimeException();
		}
	}

	private boolean isMungpleCreated(String geoHash) {
		return redisTemplate.hasKey("mungple:" + geoHash);
	}
}
