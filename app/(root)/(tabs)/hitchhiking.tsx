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

// const solicitacoesDeCarona = [
//   {
//     ride_id: "1",
//     origin_address: "Kathmandu, Nepal",
//     destination_address: "Pokhara, Nepal",
//     origin_latitude: 27.717245,
//     origin_longitude: 85.323961,
//     destination_latitude: 28.209583,
//     destination_longitude: 83.985567,
//     ride_time: 391,
//     fare_price: 19500.0,
//     payment_status: "paid",
//     driver_id: 2,
//     user_id: "1",
//     user_email: "david@mail.com",
//     created_at: "2024-08-12 05:19:20.620007",
//     driver: {
//       driver_id: "2",
//       first_name: "David",
//       last_name: "Brown",
//       profile_image_url:
//         "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
//       car_image_url:
//         "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
//       car_seats: 5,
//       rating: "4.60",
//     },
//   },
//   {
//     ride_id: "2",
//     origin_address: "Jalkot, MH",
//     destination_address: "Pune, Maharashtra, India",
//     origin_latitude: 18.609116,
//     origin_longitude: 77.165873,
//     destination_latitude: 18.52043,
//     destination_longitude: 73.856744,
//     ride_time: 491,
//     fare_price: 24500.0,
//     payment_status: "paid",
//     driver_id: 1,
//     user_id: "1",
//     user_email: "james@mail.com",
//     created_at: "2024-08-12 06:12:17.683046",
//     driver: {
//       driver_id: "1",
//       first_name: "James",
//       last_name: "Wilson",
//       profile_image_url:
//         "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
//       car_image_url:
//         "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
//       car_seats: 4,
//       rating: "4.80",
//     },
//   },
//   {
//     ride_id: "3",
//     origin_address: "Zagreb, Croatia",
//     destination_address: "Rijeka, Croatia",
//     origin_latitude: 45.815011,
//     origin_longitude: 15.981919,
//     destination_latitude: 45.327063,
//     destination_longitude: 14.442176,
//     ride_time: 124,
//     fare_price: 6200.0,
//     payment_status: "paid",
//     driver_id: 1,
//     user_id: "1",
//     user_email: "james@mail.com",
//     created_at: "2024-08-12 08:49:01.809053",
//     driver: {
//       driver_id: "1",
//       first_name: "James",
//       last_name: "Wilson",
//       profile_image_url:
//         "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
//       car_image_url:
//         "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
//       car_seats: 4,
//       rating: "4.80",
//     },
//   },
//   {
//     ride_id: "4",
//     origin_address: "Okayama, Japan",
//     destination_address: "Osaka, Japan",
//     origin_latitude: 34.655531,
//     origin_longitude: 133.919795,
//     destination_latitude: 34.693725,
//     destination_longitude: 135.502254,
//     ride_time: 159,
//     fare_price: 7900.0,
//     payment_status: "paid",
//     driver_id: 3,
//     user_id: "1",
//     user_email: "michael@mail.com",
//     created_at: "2024-08-12 18:43:54.297838",
//     driver: {
//       driver_id: "3",
//       first_name: "Michael",
//       last_name: "Johnson",
//       profile_image_url:
//         "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
//       car_image_url:
//         "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
//       car_seats: 4,
//       rating: "4.70",
//     },
//   },
// ];

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

  const handleSignOut = () => {
    // signOut();
    router.replace("/(root)/(auth)/login");
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
