interface Point {
  lat: number;
  lon: number;
}

interface ToZone {
  // requestId: string;
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

interface ToLocation {
  lat: number;
  lon: number;
  recordedAt: string;
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
  ToLocation,
  ToMungZone,
  PetFacility,
  FacilityPoints,
  PetFacilityDetail,
};
