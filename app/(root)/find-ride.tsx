import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { useLocationStore } from "@/store";
import RideLayout from "@/components/RideLayout";
import GoogleTextInput from "@/components/GoogleTextInput";
import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useState } from "react";

const FindRide = () => {
  const {
    userAddress,
    destinationAddress,
    setDestinationLocation,
    setUserLocation,
  } = useLocationStore();

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState<"date" | "time" | undefined>();
  const [showPicker, setShowPicker] = useState(false);
  const [txDate, setTxDate] = useState(
    `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`,
  );
  const [txTime, setTxTime] = useState(
    `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`,
  );

  const showDatePicker = () => setShowPicker(true);

  const showMode = (currentMode: any) => {
    setShowPicker(true);
    setMode(currentMode);
  };

  // Função de callback para salvar a data/hora selecionada
  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowPicker(false); // Fechar o picker após selecionar
    setDate(currentDate);

    const tempDate = new Date(currentDate);

    // Formatação de data
    const fDate = `${tempDate.getDate().toString().padStart(2, "0")}/${(
      tempDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${tempDate.getFullYear()}`;

    // Formatação de hora
    const fTime = `${tempDate.getHours().toString().padStart(2, "0")}:${tempDate
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    setTxDate(fDate);
    setTxTime(fTime);
  };

  return (
    <SafeAreaView className="flex-1 bg-general-500">
      {/* Header */}
      <View className="flex flex-row items-center bg-general-500 p-5 mt-4">
        <TouchableOpacity onPress={() => router.back()}>
          <View className="w-10 h-10 bg-general-500 rounded-full items-center justify-center">
            <Image
              source={icons.backArrow}
              resizeMode="contain"
              className="w-6 h-6"
            />
          </View>
        </TouchableOpacity>
        <Text className="text-xl font-JakartaSemiBold ml-5">
          Solicitar Carona
        </Text>
      </View>

      {/* Form Content */}
      <View
        className="flex-1 px-4 py-5"
        // contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* User Location */}
        <View className="mb-5">
          <Text className="text-lg font-JakartaSemiBold mb-2">De</Text>
          <GoogleTextInput
            icon={icons.target}
            initialLocation={userAddress!}
            containerStyle="bg-neutral-100"
            textInputBackgroundColor="#f5f5f5"
            handlePress={(location) => setUserLocation(location)}
          />
        </View>

        {/* Destination */}
        <View className="mb-5">
          <Text className="text-lg font-JakartaSemiBold mb-2">Para</Text>
          <GoogleTextInput
            icon={icons.map}
            initialLocation={destinationAddress!}
            containerStyle="bg-neutral-100"
            textInputBackgroundColor="transparent"
            handlePress={(location) => setDestinationLocation(location)}
          />
        </View>

        {/* Date Picker */}
        <View className="mb-5">
          <Text className="text-lg font-JakartaSemiBold mb-2">Data</Text>
          <TouchableOpacity
            onPress={() => showMode("date")}
            className="bg-neutral-100 p-4 rounded-lg"
          >
            <Text className="text-lg text-gray-600">{txDate}</Text>
          </TouchableOpacity>
        </View>

        {/* Time Picker */}
        <View className="mb-5">
          <Text className="text-lg font-JakartaSemiBold mb-2">Horário</Text>
          <TouchableOpacity
            onPress={() => showMode("time")}
            className="bg-neutral-100 p-4 rounded-lg"
          >
            <Text className="text-lg text-gray-600">{txTime}</Text>
          </TouchableOpacity>
        </View>

        {/* Render DateTimePicker */}
        {showPicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            display="default"
            onChange={onDateChange}
            is24Hour={true}
          />
        )}

        {/* Submit Button */}
        <CustomButton
          title="Solicitar Carona"
          onPress={() => console.log("Find Now pressed")}
          className="mt-5"
        />
      </View>
    </SafeAreaView>
  );
};

export default FindRide;
