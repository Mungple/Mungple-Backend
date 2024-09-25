package com.e106.mungplace.common.map.dto;

import org.springframework.data.elasticsearch.core.geo.GeoPoint;

import co.elastic.clients.elasticsearch._types.GeoLocation;
import co.elastic.clients.elasticsearch._types.LatLonGeoLocation;

public record Point(
	Double lat,
	Double lon
) {

	public static Point of(GeoPoint point) {
		return new Point(point.getLat(), point.getLon());
	}

	public static Point of(GeoLocation location) {
		return new Point(location.latlon().lat(), location.latlon().lon());
	}

	public GeoPoint toGeoPoint() {
		return new GeoPoint(lat, lon);
	}

	public GeoLocation toGeoLocation() {
		return GeoLocation.of(b -> b.latlon(LatLonGeoLocation.of(ll -> ll.lat(lat).lon(lon))));
	}
}