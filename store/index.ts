import { create } from "zustand";

import { LocationStore, RideStore, MarkerData } from "@/types/type";

export const useLocationStore = create<LocationStore>((set) => ({
  userAddress: null,
  userLongitude: null,
  userLatitude: null,
  userPlaceId: null,
  destinationLongitude: null,
  destinationLatitude: null,
  destinationAddress: null,
  destinationPlaceId: null,
  referenceLongitude: null,
  referenceLatitude: null,
  referenceAddress: null,
  referencePlaceId: null,
  
  setUserLocation: ({
    latitude,
    longitude,
    address,
    placeId,
  }: {
    latitude: number;
    longitude: number;
    address: string;
    placeId: string;
  }) => {
    set(() => ({
      userLatitude: latitude,
      userLongitude: longitude,
      userAddress: address,
      userPlaceId: placeId,
    }));
  },

  setDestinationLocation: ({
    latitude,
    longitude,
    address,
    placeId
  }: {
    latitude: number;
    longitude: number;
    address: string;
    placeId: string;
  }) => {
    set(() => ({
      destinationLatitude: latitude,
      destinationLongtitude: longitude,
      destinationAddress: address,
      destinationPlaceId: placeId,
    }));
  },

  setReferencePoint: ({
    latitude,
    longitude,
    address,
    placeId,
  }: {
    latitude: number;
    longitude: number;
    address: string;
    placeId: string;
  }) => {
    set(() => ({
      referenceLatitude: latitude,
      referenceLongitude: longitude,
      referenceAddress: address,
      referencePlaceId: placeId,
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
