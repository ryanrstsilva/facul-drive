import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { format } from "date-fns";

import RideCard from "@/components/RideCard";
import { images, icons } from "@/constants";
import { Ride } from "@/types/type";

const availableRides = [
  {
    origin_address: "Vila Ipanema, Ipatinga - MG",
    destination_address: "Centro, Timóteo - MG",
    car_seats: 4,
    origin_latitude: -19.4857015,
    origin_longitude: -42.5168555,
    destination_latitude: -19.5388399,
    destination_longitude: -42.6526619,
    date: new Date(2024, 10, 30, 7, 0, 0, 0),
    driver: { name: "Fulano da Silva", matricula: "20241992137" },
  },
];

const Rides = () => {
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["75%", "40%"];

  const handleSignOut = () => {
    router.replace("/(root)/(auth)/sign-in");
  };

  const handleRideSelect = (ride: Ride) => {
    setSelectedRide(ride);
    bottomSheetRef.current?.snapToPosition("65%");
  };

  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.close(); // Close bottom sheet
    setSelectedRide(null);
  };

  const handleConfirmRide = () => {
    // Lógica para confirmar a carona
    alert("Carona confirmada!");
    handleCloseBottomSheet();
  };

  const handleRegisterRide = () => {
    router.push("/(root)/register-ride");
  };

  const loading = false;

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="bg-general-500 flex-1">
        <FlatList
          data={availableRides}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleRideSelect(item)}>
              <RideCard ride={item} />
            </TouchableOpacity>
          )}
          className="px-5"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: 100,
          }}
          ListEmptyComponent={() => (
            <View className="flex flex-col items-center justify-center">
              {!loading ? (
                <>
                  <Image
                    source={images.noResult}
                    className="w-40 h-40"
                    alt="No recent rides found"
                    resizeMode="contain"
                  />
                  <Text className="text-sm">No recent rides found</Text>
                </>
              ) : (
                <ActivityIndicator size="small" color="#000" />
              )}
            </View>
          )}
          ListHeaderComponent={
            <>
              <View className="flex flex-row items-center justify-between my-5">
                <Text className="text-2xl font-JakartaExtraBold">
                  Caronas Disponíveis
                </Text>
                <TouchableOpacity
                  onPress={handleSignOut}
                  className="justify-center items-center w-10 h-10 rounded-full bg-blue"
                >
                  <Image source={icons.out} className="w-4 h-4" />
                </TouchableOpacity>
              </View>
            </>
          }
        />

        {/* Botão Flutuante */}
        <TouchableOpacity
          className="absolute bottom-24 right-8 w-16 h-16 bg-blue-950 rounded-full flex items-center justify-center shadow-lg mb-6"
          onPress={handleRegisterRide}
        >
          <Image source={icons.plus} className="w-14 h-14" />
        </TouchableOpacity>

        {/* BottomSheet para detalhes da carona */}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          onClose={handleCloseBottomSheet}
        >
          {selectedRide && (
            <BottomSheetScrollView
              contentContainerStyle={{
                padding: 20,
                backgroundColor: "white",
              }}
            >
              <Text className="text-2xl font-JakartaSemiBold mb-4">
                Detalhes
              </Text>

              <View className="flex flex-row items-center justify-between mb-4">
                <View className="flex flex-row items-center">
                  <Text className="text-md font-JakartaSemiBold">
                    Nome: {selectedRide.driver.name}
                  </Text>
                </View>
              </View>

              <View className="bg-gray-100 rounded-xl p-4 mb-4">
                <View className="flex flex-row justify-between mb-2">
                  <Text className="font-JakartaRegular">De:</Text>
                  <Text className="font-JakartaSemiBold">
                    {selectedRide.origin_address}
                  </Text>
                </View>
                <View className="flex flex-row justify-between mb-2">
                  <Text className="font-JakartaRegular">Para:</Text>
                  <Text className="font-JakartaSemiBold">
                    {selectedRide.destination_address}
                  </Text>
                </View>
                <View className="flex flex-row justify-between mb-2">
                  <Text className="font-JakartaRegular">Data & Horário:</Text>
                  <Text className="font-JakartaSemiBold">
                    {format(selectedRide.date, "dd LLL yyyy, HH:mm")}
                  </Text>
                </View>
                <View className="flex flex-row justify-between">
                  <Text className="font-JakartaRegular">Vagas:</Text>
                  <Text className="font-JakartaSemiBold">
                    {selectedRide.car_seats}
                  </Text>
                </View>
              </View>

              <View className="flex flex-row justify-center items-center">
                <TouchableOpacity
                  onPress={handleConfirmRide}
                  className="bg-blue-950 px-6 py-3 rounded-full justify-center"
                >
                  <Text className="text-white font-JakartaSemiBold">
                    Solicitar Carona
                  </Text>
                </TouchableOpacity>
              </View>
            </BottomSheetScrollView>
          )}
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Rides;
