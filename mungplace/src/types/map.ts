interface Point {
  lat: number;
  lon: number;
}

interface PetFacility {
  id: number;
  point: Point;
}

interface FacilityPoints {
  facilityPoints: PetFacility[];
}

interface PetFacilityDetail {
  id: number;
  name: string;
  address: string;
  phone: string;
  homepage: string;
  closedDays: string;
  businessHours: string;
  description: string;
}

export type { Point, FacilityPoints, PetFacility, PetFacilityDetail };
