import * as Location from "expo-location";
import { router } from "expo-router";
import { useRef, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import RecentRideCard from "@/components/RecentRideCard";
import { icons, images } from "@/constants";
import { useLocationStore } from "@/store";
import { SolicitacaoCaronaModel } from "@/global/solicitacaoCarona";
import { aprovarSolcitacao, listarSolicitacoes } from "@/service/carona";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { format } from "date-fns";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from "react";

const solicitacoes: SolicitacaoCaronaModel[] = [];

const Home = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["75%", "40%"];
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const [solicitacoesList, setSolicitacoesList] = useState(solicitacoes);
  const [filteredSolicitacoes, setFilteredSolicitacoes] =
    useState(solicitacoes);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false); // Estado para controlar o carregamento da atualização
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRide, setSelectedRide] =
    useState<SolicitacaoCaronaModel | null>(null);

  const handleSignOut = async () => {
    try {
      // Limpar o estado de autenticação
      await AsyncStorage.removeItem('authToken');
      // Redirecionar para a tela de login
      router.replace("/(root)/(auth)/login");
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  };

  const [hasPermissions, setHasPermissions] = useState<boolean>(false);

  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setHasPermissions(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: `${address[0].subregion}, ${address[0].region}`,
        placeId: "",
      });
    };

    requestLocation();
  }, []);

  const aprovar = async (id: number) => {
    try {
      setIsLoading(true);
      await aprovarSolcitacao(id);
      setSolicitacoesList((prevList) =>
        prevList.map((solicitacao) =>
          solicitacao.id === id
            ? { ...solicitacao, aprovado: true }
            : solicitacao,
        ),
      );
      console.log("Solicitação enviada com sucesso!");
      handleCloseBottomSheet();
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
    } finally {
      setIsLoading(false); // Desativa o carregamento
      setIsRefreshing(false); // Desativa o refresh
    }
  };

  useEffect(() => {
    buscarSolicitacoes();
  }, []);

  const handleSolicitaionSelect = (ride: SolicitacaoCaronaModel) => {
    setSelectedRide(ride);
    bottomSheetRef.current?.snapToPosition("65%");
  };

  const buscarSolicitacoes = async () => {
    try {
      setIsLoading(true);
      const solicitacoes = await listarSolicitacoes();
      setSolicitacoesList(solicitacoes);
      setFilteredSolicitacoes(solicitacoes);
      console.log("Ofertas de carona:", solicitacoes);
    } catch (error) {
      console.error("Erro ao buscar solicitações de carona:", error);
    } finally {
      setIsLoading(false); // Desativa o carregamento
      setIsRefreshing(false); // Desativa o refresh
    }
  };
  useEffect(() => {
    buscarSolicitacoes();
  }, []);

  const loading = false;

  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
    placeId: string;
  }) => {
    setDestinationLocation(location);

    router.push("/(root)/find-ride");
  };

  // const handleSolicitation = () => {

  // };

  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.close(); // Close bottom sheet
    setSelectedRide(null);
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="bg-general-500 ">
        <FlatList
          data={solicitacoesList}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSolicitaionSelect(item)}>
              <RecentRideCard ride={item} />
            </TouchableOpacity>
          )}
          className="px-5"
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={buscarSolicitacoes}
            />
          }
          ListEmptyComponent={() => (
            <View className="flex flex-clo items-center justify-center">
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
          contentContainerStyle={{
            paddingBottom: 100,
          }}
          ListHeaderComponent={
            <>
              <View className="flex flex-row items-center justify-between my-5">
                <Text className="text-2xl font-JakartaExtraBold">
                  Caronas Solicitadas
                </Text>
                <TouchableOpacity
                  onPress={handleSignOut}
                  className="justify-center items-center w-10 h-10 rounded-full bg-white"
                >
                  <Image source={icons.out} className="w-4 h-4" />
                </TouchableOpacity>
              </View>

              <GoogleTextInput
                icon={icons.search}
                containerStyle="bg-white shadow-md shadow-neutral-300"
                handlePress={handleDestinationPress}
                placeholder="Quer uma carona pra onde?"
              />

              <>
                <Text className="text-xl font-JakartaBold mt-5 mb-3">
                  Sua localização atual
                </Text>
                <View className="flex flex-row items-center bg-transparent h-[300px]">
                  <Map />
                </View>
              </>

              <Text className="text-xl font-JakartaBold mt-5 mb-3">
                Solicitações
              </Text>
            </>
          }
        />

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
                    Nome: {selectedRide.nome}
                  </Text>
                </View>
              </View>

              <View className="bg-gray-100 rounded-xl p-4 mb-4">
                <View className="flex flex-row justify-between mb-2">
                  <Text className="font-JakartaRegular">De:</Text>
                  <Text className="font-JakartaSemiBold">
                    {selectedRide.saida}
                  </Text>
                </View>
                <View className="flex flex-row justify-between mb-2">
                  <Text className="font-JakartaRegular">Para:</Text>
                  <Text className="font-JakartaSemiBold">
                    {selectedRide.destino}
                  </Text>
                </View>
                <View className="flex flex-row justify-between mb-2">
                  <Text className="font-JakartaRegular">Data & Horário:</Text>
                  <Text className="font-JakartaSemiBold">
                    {format(selectedRide.dataCarona, "dd LLL yyyy, HH:mm")}
                  </Text>
                </View>
                {/* <View className="flex flex-row justify-between">
                <Text className="font-JakartaRegular">Vagas:</Text>
                <Text className="font-JakartaSemiBold">
                  {selectedRide.} / {selectedRide.nVagas}
                </Text>
              </View> */}
              </View>

              <View className="flex flex-row justify-center items-center">
                {!selectedRide.aprovado && ( // Condição: só exibe se não estiver aprovada
                  <TouchableOpacity
                    onPress={() => aprovar(selectedRide.id)}
                    className="bg-blue-950 px-6 py-3 rounded-full justify-center"
                  >
                    <Text className="text-white font-JakartaSemiBold">
                      Aprovar
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </BottomSheetScrollView>
          )}
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Home;
