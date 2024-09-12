// src/types/ngeohash.d.ts
declare module 'ngeohash' {
  export function encode(latitude: number, longitude: number, precision?: number): string;
  export function decode(geohash: string): { latitude: number; longitude: number };
  export function encode_int(latitude: number, longitude: number, bitDepth?: number): number;
  export function decode_int(geohashInt: number, bitDepth?: number): { latitude: number; longitude: number };
  export function bounds(geohash: string): { ne: { latitude: number; longitude: number }, sw: { latitude: number; longitude: number }};
  export function neighbor(geohash: string, direction: string): string;
}
