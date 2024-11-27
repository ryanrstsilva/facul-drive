import { create } from "zustand";

import { LocationStore, RideStore, MarkerData } from "@/types/type";

export const useLocationStore = create<LocationStore>((set) => ({
  userAddress: null,
  userLongitude: null,
  userLatitude: null,
  destinationLongitude: null,
  destinationLatitude: null,
  destinationAddress: null,
  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      userLatitude: latitude,
      userLongitude: longitude,
      userAddress: address,
    }));
  },
  setDestinationLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      destinationLatitude: latitude,
      destinationLongtitude: longitude,
      destinationAddress: address,
    }));
  },
}));

export const useRideStore = create<RideStore>((set) => ({
  rides: [] as MarkerData[],
  selectedRide: null,
  setSelectedRide: (rideId: number) => set(() => ({ selectedRide: rideId })),
  setRides: (rides: MarkerData[]) => set(() => ({ rides })),
  clearSelectedRide: () => set(() => ({ selectedRide: null })),
}));
