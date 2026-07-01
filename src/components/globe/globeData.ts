import * as THREE from "three";

export type Region = "dach" | "na" | "global";
export type LocationRegion = Exclude<Region, "global">;

export type GlobeLocation = {
  id: string;
  lat: number;
  lng: number;
  region: LocationRegion;
  hub?: boolean;
};

export const GLOBE_RADIUS = 1;

/** Featured client locations. `pl` is the home base (hub) and is always active. */
export const LOCATIONS: GlobeLocation[] = [
  { id: "pl", lat: 52.23, lng: 21.01, region: "dach", hub: true }, // Warsaw
  { id: "de", lat: 52.52, lng: 13.405, region: "dach" }, // Berlin
  { id: "at", lat: 48.21, lng: 16.37, region: "dach" }, // Vienna
  { id: "ch", lat: 47.37, lng: 8.54, region: "dach" }, // Zurich
  { id: "us", lat: 40.71, lng: -74.0, region: "na" }, // New York
  { id: "ca", lat: 43.65, lng: -79.38, region: "na" }, // Toronto
];

/** Hub-and-spoke links from the home base, plus one cross-link for richness. */
export const CONNECTIONS: [string, string][] = [
  ["pl", "de"],
  ["pl", "at"],
  ["pl", "ch"],
  ["pl", "us"],
  ["pl", "ca"],
  ["de", "us"],
];

const REGION_OF: Record<string, LocationRegion> = Object.fromEntries(
  LOCATIONS.map((l) => [l.id, l.region])
);
const HUB_OF: Record<string, boolean> = Object.fromEntries(
  LOCATIONS.map((l) => [l.id, !!l.hub])
);

/** Convert lat/lng (degrees) to a point on a sphere of the given radius. */
export function latLngToVector3(
  lat: number,
  lng: number,
  radius = GLOBE_RADIUS
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

/** Quadratic-bezier arc between two surface points, lifted off the globe. */
export function buildArc(a: THREE.Vector3, b: THREE.Vector3, lift = 0.35) {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const dist = a.distanceTo(b);
  mid.normalize().multiplyScalar(GLOBE_RADIUS + lift * dist + 0.08);
  return new THREE.QuadraticBezierCurve3(a.clone(), mid, b.clone());
}

export function locationActive(region: Region, id: string): boolean {
  if (region === "global") return true;
  if (HUB_OF[id]) return true;
  return REGION_OF[id] === region;
}

export function arcActive(region: Region, a: string, b: string): boolean {
  if (region === "global") return true;
  return locationActive(region, a) && locationActive(region, b);
}
