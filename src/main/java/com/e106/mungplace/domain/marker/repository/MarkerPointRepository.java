package com.e106.mungplace.domain.marker.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.core.geo.GeoPoint;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.e106.mungplace.domain.marker.entity.MarkerPoint;
import com.e106.mungplace.web.marker.dto.RequestMarkerType;

public interface MarkerPointRepository extends ElasticsearchRepository<MarkerPoint, UUID> {

	List<MarkerPoint> findByPointNear(GeoPoint point, String distance);

	List<MarkerPoint> findByPointNearAndType(GeoPoint point, String distance, RequestMarkerType type);

	@Query("""
		    {
		      "bool": {
		        "must": [
		          {
		            "geo_distance": {
		              "distance": "?0",
		              "point": {
		                "lat": ?1,
		                "lon": ?2
		              }
		            }
		          },
		          {
		            "range": {
		              "createdAt": {
		                "gte": "?3",
		                "lte": "?4"
		              }
		            }
		          }
		        ]
		      }
		    }
		""")
	List<MarkerPoint> findMarkersByGeoDistanceAndCreatedAtRange(String distance, double lat, double lon, String gte,
		String lte);

	@Query("""
		   {
		  "bool": {
			"must": [
			  {
				"geo_distance": {
				  "distance": "?0",
				  "point": {
					"lat": ?1,
					"lon": ?2
				  }
				}
			  },
			  {
				"range": {
				  "createdAt": {
					"gte": "?3",
					"lte": "?4"
				  }
				}
			  },
			  {
				"term": {
				  "type": "?5"
				}
			  }
			]
		  }
		}
		""")
	List<MarkerPoint> findMarkersByGeoDistanceAndCreatedAtRangeAndType(String distance, double lat, double lon,
		String gte, String lte, String type);
}