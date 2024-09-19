package com.e106.mungplace.domain.util;

import org.gavaghan.geodesy.Ellipsoid;
import org.gavaghan.geodesy.GeodeticCalculator;
import org.gavaghan.geodesy.GlobalCoordinates;
import org.springframework.data.geo.Point;

public class GeoUtils {

	public static Point calculateNorthWestPoint(Point point, int sideLength) {
		GlobalCoordinates nw = calculateOffset(new GlobalCoordinates(point.getX(), point.getY()), -45,
			sideLength / Math.sqrt(2));

		return new Point(nw.getLatitude(), nw.getLongitude());
	}

	public static Point calculateSouthEastPoint(Point point, int sideLength) {
		GlobalCoordinates nw = calculateOffset(new GlobalCoordinates(point.getX(), point.getY()), 135,
			sideLength / Math.sqrt(2));

		return new Point(nw.getLatitude(), nw.getLongitude());
	}

	private static GlobalCoordinates calculateOffset(GlobalCoordinates center, double bearing, double distanceMeters) {
		GeodeticCalculator geoCalc = new GeodeticCalculator();
		Ellipsoid reference = Ellipsoid.WGS84;

		return geoCalc.calculateEndingGlobalCoordinates(reference, center, bearing, distanceMeters);
	}
}
