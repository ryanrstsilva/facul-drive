import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useRef, useState, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
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
import { OfertaCarona } from "@/global/ofertaCarona";
import {
  novaSolicitacao,
  excluirSolicitacao,
  listarOfertasCaronas,
} from "@/service/carona";

const ofertasCaronas: OfertaCarona[] = [];

const Rides = () => {
  const [ofertasList, setOfertasList] = useState(ofertasCaronas);
  const [filteredOfertas, setFilteredOfertas] = useState(ofertasCaronas);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false); // Estado para controlar o carregamento da atualização
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar o loading

  const [selectedRide, setSelectedRide] = useState<OfertaCarona | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["75%", "40%"];

  const handleSignOut = () => {
    router.replace("/(root)/(auth)/login");
  };

  const handleRideSelect = (ride: OfertaCarona) => {
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

  const adicionarSolicitacao = async (id: number) => {
    try {
      setIsLoading(true);
      const params = { IdOfertaCarona: id };
      await novaSolicitacao(params);
      console.log("Solicitação enviada com sucesso!");
      buscarOfertas();
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
    } finally {
      setIsLoading(false); // Desativa o carregamento
      setIsRefreshing(false); // Desativa o refresh
    }
    bottomSheetRef.current?.close();
  };

  const excluir = async (id: number) => {
    console.log("Excluiindo");
    try {
      setIsLoading(true);
      const params = { Id: id };
      await excluirSolicitacao(params);
      console.log("Solicitação enviada com sucesso!");
      buscarOfertas();
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
    } finally {
      setIsLoading(false); // Desativa o carregamento
      setIsRefreshing(false); // Desativa o refresh
    }
    bottomSheetRef.current?.close();
  };

  const buscarOfertas = async () => {
    try {
      setIsLoading(true);
      const ofertas = await listarOfertasCaronas();
      setOfertasList(ofertas);
      setFilteredOfertas(ofertas);
    } catch (error) {
      console.error("Erro ao buscar ofertas de carona:", error);
    } finally {
      setIsLoading(false); // Desativa o carregamento
      setIsRefreshing(false); // Desativa o refresh
    }
  };

  useEffect(() => {
    buscarOfertas();
  }, []); // O array vazio garante que o useEffect execute apenas uma vez

  const loading = false;

  const filterOfertas = (searchTerm: string) => {
    if (!searchTerm) {
      setFilteredOfertas(ofertasList);
    } else {
      const lowerTerm = searchTerm.toLowerCase();

      const filtered = ofertasList.filter(
        (oferta) =>
          oferta.saida.toLowerCase().includes(lowerTerm) ||
          oferta.destino.toLowerCase().includes(lowerTerm) ||
          oferta.pontosReferencia.toLowerCase().includes(lowerTerm),
      );
      console.log(filtered);

      setFilteredOfertas(filtered);
    }
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="bg-general-500 flex-1">
        <FlatList
          data={ofertasList}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => handleRideSelect(item)}>
              <RideCard ride={item} />
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={buscarOfertas}
            />
          }
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
                    Nome: {selectedRide.nomePessoaOfertante}
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
                <View className="flex flex-row justify-between">
                  <Text className="font-JakartaRegular">Vagas:</Text>
                  <Text className="font-JakartaSemiBold">
                    {selectedRide.nVagasRestantes} / {selectedRide.nVagas}
                  </Text>
                </View>
              </View>

              <View className="flex flex-row justify-center items-center">
                {/* Logic */}
                {selectedRide.meuStatusSolicitacao === null &&
                  !selectedRide.minhaOferta && (
                    <TouchableOpacity
                      className="bg-blue-950 px-6 py-3 rounded-full justify-center"
                      onPress={() => adicionarSolicitacao(selectedRide.id)}
                    >
                      <Text className="text-white font-JakartaSemiBold">
                        Solicitar
                      </Text>
                    </TouchableOpacity>
                  )}
                {selectedRide.meuStatusSolicitacao !== null &&
                  !selectedRide.minhaOferta &&
                  selectedRide.meuStatusSolicitacao === "Aguardando" && (
                    <TouchableOpacity
                      className="bg-red-950 px-6 py-3 rounded-full justify-center"
                      onPress={() => excluir(selectedRide.idMinhaSolicitacao)}
                    >
                      <Text className="text-white font-JakartaSemiBold">
                        Cancelar
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

export default Rides;
