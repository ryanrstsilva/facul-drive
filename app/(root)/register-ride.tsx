import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";

import { icons } from "@/constants";
import GoogleTextInput from "@/components/GoogleTextInput";
import CustomButton from "@/components/CustomButton";
import { useLocationStore } from "@/store";

const RegisterRide = () => {
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
      .padStart(2, "0")}/${date.getFullYear()}`
  );
  const [txTime, setTxTime] = useState(
    `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`
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

  const [seats, setSeats] = useState(1);

  // Função para incrementar ou decrementar o número de assentos
  const handleSeatsChange = (action: "increase" | "decrease") => {
    if (action === "increase" && seats < 4) {
      setSeats(seats + 1);
    } else if (action === "decrease" && seats > 1) {
      setSeats(seats - 1);
    }
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
        <Text className="text-2xl font-JakartaSemiBold ml-5">
          Registrar Carona
        </Text>
      </View>

      {/* Form Content */}
      <View
        className="flex-1 px-4 py-5"
        // contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* User Location */}
        <View className="mb-5">
          <Text className="text-lg font-JakartaSemiBold mb-2">De:</Text>
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
          <Text className="text-lg font-JakartaSemiBold mb-2">Para:</Text>
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
          <Text className="text-lg font-JakartaSemiBold mb-2">Data:</Text>
          <TouchableOpacity
            onPress={() => showMode("date")}
            className="bg-neutral-100 p-4 rounded-lg"
          >
            <Text className="text-lg text-gray-600">{txDate}</Text>
          </TouchableOpacity>
        </View>

        {/* Time Picker */}
        <View className="mb-5">
          <Text className="text-lg font-JakartaSemiBold mb-2">Horário:</Text>
          <TouchableOpacity
            onPress={() => showMode("time")}
            className="bg-neutral-100 p-4 rounded-lg"
          >
            <Text className="text-lg text-gray-600">{txTime}</Text>
          </TouchableOpacity>
        </View>

        {/* Seats */}
        <View className="mb-5">
          <Text className="text-lg font-JakartaSemiBold mb-2">Vagas:</Text>
          <View className="flex-row items-center bg-neutral-100 p-4 rounded-lg justify-between">
            {/* Número de assentos */}
            <Text className="text-lg font-JakartaRegular">
              {seats}
            </Text>

            {/* Botões de incremento/decremento */}
            <View className="flex-row items-center">
              {/* Botão de decrementar */}
              <TouchableOpacity
                onPress={() => handleSeatsChange("decrease")}
                className="p-2 bg-red-800 rounded-l-lg"
              >
                <Image
                  source={icons.minus}
                  className="w-10 h-10"
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {/* Separador */}
              <View className="w-0.5 bg-gray-300 h-full" />

              {/* Botão de incrementar */}
              <TouchableOpacity
                onPress={() => handleSeatsChange("increase")}
                className="p-2 bg-blue-800 rounded-r-lg"
              >
                <Image
                  source={icons.plus}
                  className="w-10 h-10"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
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
          title="Registrar Carona"
          onPress={() => console.log("Find Now pressed")}
          className="mt-10"
        />
      </View>
    </SafeAreaView>
  );
};

export default RegisterRide;
