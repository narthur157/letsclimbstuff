export class Location {
  latitude: number;
  longitude: number;

  constructor(lat: number, lon: number) {
    this.latitude = lat
    this.longitude = lon
  }
}

export const DISTANCE_THRESHOLD_KM = 5
export const MSG_EXP_MIN = 45


