package com.e106.mungplace.web.facility.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.client.elc.NativeQueryBuilder;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;

import com.e106.mungplace.common.log.MethodLoggable;
import com.e106.mungplace.common.log.dto.LogAction;
import com.e106.mungplace.common.map.dto.Point;
import com.e106.mungplace.domain.facility.entity.PetFacilityPoint;
import com.e106.mungplace.domain.facility.repository.PetFacilityRepository;
import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exception.dto.ApplicationError;
import com.e106.mungplace.web.facility.dto.PetFacilityPointResponse;
import com.e106.mungplace.web.facility.dto.PetFacilityResponse;
import com.e106.mungplace.web.facility.dto.PetFacilitySearchResponse;

import co.elastic.clients.elasticsearch._types.GeoDistanceType;
import co.elastic.clients.elasticsearch._types.query_dsl.QueryBuilders;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class PetFacilityService {

	private final ElasticsearchOperations elasticsearchOperations;
	private final PetFacilityRepository petFacilityRepository;

	@MethodLoggable(action = LogAction.SELECT)
	public PetFacilitySearchResponse searchNearbyPetFacilityProcess(Point point, Integer radius) {
		NativeQuery query = new NativeQueryBuilder()
			.withFilter(QueryBuilders.geoDistance(builder ->
				builder.field("point")
					.location(point.toGeoLocation())
					.distance(Integer.toString(radius))
					.distanceType(GeoDistanceType.Plane)
			))
			.withMaxResults(10000)
			.build();

		SearchHits<PetFacilityPoint> searchHits = elasticsearchOperations.search(query, PetFacilityPoint.class);

		List<PetFacilityPointResponse> list = searchHits.stream()
			.map(SearchHit::getContent)
			.map(PetFacilityPointResponse::of)
			.toList();

		return new PetFacilitySearchResponse(list);
	}

	@MethodLoggable(action = LogAction.SELECT)
	public PetFacilityResponse getPetFacilityById(Long id) {
		return petFacilityRepository.findById(id)
			.map(PetFacilityResponse::of)
			.orElseThrow(() -> new ApplicationException(ApplicationError.FACILITY_NOT_FOUND));
	}
}
