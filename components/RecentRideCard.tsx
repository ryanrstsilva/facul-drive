import { Image, Text, TouchableOpacity, View } from "react-native";

import { icons } from "@/constants";
import { RecentRide } from "@/types/type";
import { formatDate, formatTime } from "@/lib/utils";
import { router } from "expo-router";
import { SolicitacaoCaronaModel } from "@/global/solicitacaoCarona";

const RecentRideCard = ({ ride }: { ride: SolicitacaoCaronaModel }) => {
  return (
    <View className="flex flex-row items-center justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 mb-3">
      <View className="flex flex-col items-center justify-center p-3 ">
        <View className="flex flex-row items-center justify-between">
          {/* <Image
              source={{
                uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${ride.destination_longitude},${ride.destination_latitude}&zoom=14&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`,
              }}
              className="w-[80px] h-[90px] rounded-lg"
            /> */}
          <View className="flex flex-col mx-5 gap-y-5 flex-1">
            <View className="flex flex-row items-center gap-x-2">
              <Image source={icons.to} className="w-5 h-5" />
              <Text className="text-md font-JakartaMedium" numberOfLines={1}>
                {ride.saida}
              </Text>
            </View>
            <View className="flex flex-row items-center gap-x-2">
              <Image source={icons.point} className="w-5 h-5" />
              <Text className="text-md font-JakartaMedium" numberOfLines={1}>
                {ride.destino}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex flex-col w-full mt-5 bg-general-500 rounded-lg p-3 items-start justify-center">
          <View className="flex flex-row items-center w-full justify-between mb-5">
            <Text className="text-md font-JakartaMedium text-gray-500">
              Data & Horário
            </Text>
            <Text className="text-md font-JakartaMedium text-gray-500">
              {formatDate(ride.dataCarona)}
            </Text>
          </View>

          <View className="flex flex-row items-center w-full justify-between mb-5">
            <Text className="text-md font-JakartaMedium text-gray-500">
              Solicitante
            </Text>
            <Text className="text-md font-JakartaMedium text-gray-500">
              {ride.nome}
            </Text>
          </View>

          <View className="flex flex-row items-center w-full justify-between mb-5">
            <Text className="text-md font-JakartaMedium text-gray-500">
              Status
            </Text>
            <Text className="text-md font-JakartaMedium text-gray-500">
              {ride.aprovado ? "Aprovado" : "Aguardando"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RecentRideCard;
