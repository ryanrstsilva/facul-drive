import { Image, Text, View } from "react-native";

import TempLayout from "@/components/TempLayout";
import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";
import { useRideStore, useLocationStore } from "@/store";

const BookRide = () => {
  //const { user } = useUser();
  const { userAddress, destinationAddress } = useLocationStore();
  const { rides, selectedRide } = useRideStore();

  const rideDetails = rides?.filter((ride) => +ride.id === selectedRide)[0];

  return (
    <TempLayout title="Confirmar Carona">
      <>
        <Text className="text-xl font-JakartaSemiBold mb-3">
          Informações da Carona
        </Text>

        <View className="flex flex-col w-full items-center justify-center mt-10">
          {/* <Image
            source={{ uri: rideDetails?.profile_image_url }}
            className="w-28 h-28 rounded-full"
          /> */}

          <View className="flex flex-row items-center justify-center mt-5 space-x-2">
            <Text className="text-lg font-JakartaSemiBold">
              {rideDetails?.title}
            </Text>

            <View className="flex flex-row items-center space-x-0.5">
              <Image
                source={icons.star}
                className="w-5 h-5"
                resizeMode="contain"
              />
              {/* <Text className="text-lg font-JakartaRegular">
                {rideDetails?.rating}
              </Text> */}
            </View>
          </View>
        </View>

        <View className="flex flex-col w-full items-start justify-center py-3 px-5 rounded-3xl bg-general-600 mt-5">
          <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
            <Text className="text-lg font-JakartaRegular">Ride Price</Text>
            {/* <Text className="text-lg font-JakartaRegular text-[#0CC25F]">
              ${rideDetails?.price}
            </Text> */}
          </View>

          <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
            <Text className="text-lg font-JakartaRegular">Pickup Time</Text>
            <Text className="text-lg font-JakartaRegular">
              {formatTime(rideDetails?.time!)}
            </Text>
          </View>

          <View className="flex flex-row items-center justify-between w-full py-3">
            <Text className="text-lg font-JakartaRegular">Car Seats</Text>
            <Text className="text-lg font-JakartaRegular">
              {rideDetails?.car_seats}
            </Text>
          </View>
        </View>

        <View className="flex flex-col w-full items-start justify-center mt-5">
          <View className="flex flex-row items-center justify-start mt-3 border-t border-b border-general-700 w-full py-3">
            <Image source={icons.to} className="w-6 h-6" />
            <Text className="text-lg font-JakartaRegular ml-2">
              {userAddress}
            </Text>
          </View>

          <View className="flex flex-row items-center justify-start border-b border-general-700 w-full py-3">
            <Image source={icons.point} className="w-6 h-6" />
            <Text className="text-lg font-JakartaRegular ml-2">
              {destinationAddress}
            </Text>
          </View>
        </View>
      </>
    </TempLayout>
  );
};

export default BookRide;
