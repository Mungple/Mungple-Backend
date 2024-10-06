interface Point {
  lat: number;
  lon: number;
}

interface ToZone {
  side: number;
  point: Point;
}

interface Cell {
  point: Point;
  weight: number;
}

interface FromZone {
  cells: Cell[];
}

interface ToMungZone {
  point: Point;
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

export type {
  Cell,
  Point,
  ToZone,
  FromZone,
  ToMungZone,
  PetFacility,
  FacilityPoints,
  PetFacilityDetail,
};
