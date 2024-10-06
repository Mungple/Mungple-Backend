interface Point {
  lat: number;
  lon: number;
}

interface FacilityPoints {
  id: number;
  point: Point;
}

interface PetFacility {
  facilityPoints: FacilityPoints[];
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

export type { PetFacility, PetFacilityDetail };
