import React from "react";
import { Text, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

import { calculateRegion } from "@/lib/map";
import { useLocationStore } from "@/store";

const Map = () => {
  const {
    userLongitude,
    userLatitude,
    destinationLongitude,
    destinationLatitude,
  } = useLocationStore();

  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });

  return (
    <View style={{ flex: 1, borderRadius: 20, overflow: "hidden" }}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        mapType="mutedStandard"
        showsUserLocation={true}
        userInterfaceStyle="light"
        initialRegion={region}
      />
    </View>
  );
};

export default Map;
