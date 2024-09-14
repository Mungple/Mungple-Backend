declare module 'points-cluster' {
  interface ClusteredPoint {
    latitude: number;
    longitude: number;
    count: number;
    cluster?: ClusteredPoint[];
  }

  function cluster(points: { latitude: number; longitude: number }[], options?: { radius?: number }): ClusteredPoint[];

  export = cluster;
}
