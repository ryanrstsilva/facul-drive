import { Image, Text, TouchableOpacity, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";

import { icons } from "@/constants";
import GoogleTextInput from "@/components/GoogleTextInput";
import CustomButton from "@/components/CustomButton";
import { useLocationStore } from "@/store";

import { novaOferta } from "@/service/carona";
import { OfertaCarona } from "@/global/ofertaCarona";
import { format } from "date-fns";

const RegisterRide = () => {
  const {
    userAddress,
    userPlaceId,
    destinationAddress,
    destinationPlaceId,
    referenceAddress,
    referencePlaceId,
    setDestinationLocation,
    setUserLocation,
    setReferencePoint,
  } = useLocationStore();

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState<"date" | "time" | undefined>();
  const [showPicker, setShowPicker] = useState(false);

  const showMode = (currentMode: any) => {
    setShowPicker(true);
    setMode(currentMode);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
  };

  const [seats, setSeats] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleSeatsChange = (action: "increase" | "decrease") => {
    if (action === "increase" && seats < 4) {
      setSeats(seats + 1);
    } else if (action === "decrease" && seats > 1) {
      setSeats(seats - 1);
    }
  };

  const handleRegister = () => {
    const ride: OfertaCarona = {
      saida: `${userAddress}|${userPlaceId}`,
      destino: `${destinationAddress}|${destinationPlaceId}`,
      pontosReferencia: `${referenceAddress}|${referencePlaceId}`,
      dataCarona: date,
      id: 0,
      nVagas: seats,
      nVagasRestantes: seats,
      nomePessoaOfertante: "",
      meuStatusSolicitacao: "",
      idMinhaSolicitacao: 0,
      minhaOferta: false,
    };

    console.log(ride.pontosReferencia);
    registrarCarona(ride);
  };

  const registrarCarona = async (ride: OfertaCarona) => {
    try {
      setIsLoading(true);
      const params = {
        NVagas: ride.nVagas,
        Saida: ride.saida,
        Destino: ride.destino,
        PontosReferencia: ride.pontosReferencia,
        DataCarona: format(ride.dataCarona, "yyyy-MM-dd'T'HH:mm:ss.000000"),
      };
      await novaOferta(params);
      console.log("Carona registrada com sucesso!");
    } catch (error) {
      console.error("Erro ao registrar carona:", error);
    } finally {
      setIsLoading(false);
    }
    router.back();
  };

  // Header Component
  const HeaderComponent = () => (
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
  );

  // Form Content Component
  const FormContent = () => (
    <View className="px-4">
      {/* User Location */}
      <View className="mb-5">
        <Text className="text-lg font-JakartaSemiBold mb-2">De:</Text>
        <GoogleTextInput
          icon={icons.target}
          initialLocation={userAddress!}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="#f5f5f5"
          handlePress={(location) => setUserLocation(location)}
          placeholder="Saindo de"
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
          placeholder="Está indo para onde?"
        />
      </View>
      
      {/* Reference Point */}
      <View className="mb-5">
        <Text className="text-lg font-JakartaSemiBold mb-2">Ponto de Referência:</Text>
        <GoogleTextInput
          icon={icons.map}
          initialLocation={referenceAddress!}
          containerStyle="bg-neutral-100"
          textInputBackgroundColor="transparent"
          handlePress={(location) => setReferencePoint(location)}
          placeholder="Vai passar/parar em algum lugar?"
        />
      </View>

      {/* Date Picker */}
      <View className="mb-5">
        <Text className="text-lg font-JakartaSemiBold mb-2">Data:</Text>
        <TouchableOpacity
          onPress={() => showMode("date")}
          className="bg-neutral-100 p-4 rounded-lg"
        >
          <Text className="text-lg text-gray-600">
            {format(date, "dd/MM/yyyy")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Time Picker */}
      <View className="mb-5">
        <Text className="text-lg font-JakartaSemiBold mb-2">Horário:</Text>
        <TouchableOpacity
          onPress={() => showMode("time")}
          className="bg-neutral-100 p-4 rounded-lg"
        >
          <Text className="text-lg text-gray-600">
            {format(date, "HH:mm")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Seats */}
      <View className="mb-5">
        <Text className="text-lg font-JakartaSemiBold mb-2">Vagas:</Text>
        <View className="flex-row items-center bg-neutral-100 p-4 rounded-lg justify-between">
          <Text className="text-lg font-JakartaRegular">{seats}</Text>
          <View className="flex-row items-center">
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
            <View className="w-0.5 bg-gray-300 h-full" />
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

      {/* Submit Button */}
      <CustomButton
        title="Registrar Carona"
        onPress={handleRegister}
        className="mt-10 mb-10"
        disabled={isLoading}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-general-500">
      <HeaderComponent />
      <FlatList
        data={[{ key: 'form' }]}
        renderItem={() => <FormContent />}
        keyExtractor={item => item.key}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
      
      {/* DateTimePicker - Mantido fora da FlatList */}
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
    </SafeAreaView>
  );
};

export default RegisterRide;