import { Image, Text, View } from "react-native";
import { format } from "date-fns";

import { icons } from "@/constants";
import { Ride } from "@/types/type";
import { OfertaCarona } from "@/global/ofertaCarona";

const RideCard = ({ ride }: { ride: OfertaCarona }) => {
  return (
    <View className="flex flex-row items-center justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 mb-3">
      <View className="flex flex-col items-center justify-center p-3 ">
        <View className="flex flex-row items-center justify-between">
          {/* <Image
            source={{
              uri: `https://maps.googleapis.com/maps/api/staticmap?center=${ride.destination_latitude},${ride.destination_longitude}&zoom=14&size=200x200&maptype=roadmap&markers=color:red%7Clabel:S%7C${ride.destination_latitude},${ride.destination_longitude}&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`,
            }}
            className="w-[100px] h-[100px] rounded-lg"
          /> */}
          <View className="flex flex-col mx-5 gap-y-5 flex-1">
            {/* Origin */}
            <View className="flex flex-row items-center gap-x-2">
              <Image source={icons.to} className="w-5 h-5" />
              <Text className="text-md font-JakartaMedium" numberOfLines={2}>
                {ride.saida}
              </Text>
            </View>

            {/* Destination */}
            <View className="flex flex-row items-center gap-x-2">
              <Image source={icons.point} className="w-5 h-5" />
              <Text className="text-md font-JakartaMedium" numberOfLines={2}>
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
              {format(ride.dataCarona, "dd LLL yyyy, HH:mm")}
            </Text>
          </View>

          <View className="flex flex-row items-center w-full justify-between mb-5">
            <Text className="text-md font-JakartaMedium text-gray-500">
              Motorista
            </Text>
            <Text className="text-md font-JakartaMedium text-gray-500">
              {ride.nomePessoaOfertante}
            </Text>
          </View>

          <View className="flex flex-row items-center w-full justify-between mb-5">
            <Text className="text-md font-JakartaMedium text-gray-500">
              Assentos disponíveis
            </Text>
            <Text className="text-md font-JakartaMedium text-gray-500">
              {ride.nVagasRestantes} / {ride.nVagas}
            </Text>
          </View>

          <View className="flex flex-row items-center w-full justify-between mb-5">
            <Text className="text-md font-JakartaMedium text-gray-500">
              Status
            </Text>
            <Text className="text-md font-JakartaMedium text-gray-500">
              {ride.meuStatusSolicitacao}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RideCard;
