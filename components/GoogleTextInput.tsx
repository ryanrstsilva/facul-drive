import "react-native-get-random-values";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { GoogleInputProps } from "@/types/type";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";

const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const GoogleTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
  placeholder,
}: GoogleInputProps) => {
  const { userLatitude, userLongitude, userAddress } = useLocationStore();

  return (
    <View
      className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle} mb-5`}
    >
      <GooglePlacesAutocomplete
        fetchDetails={true}
        placeholder={placeholder}
        debounce={200}
        styles={{
          textInputContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            marginHorizontal: 20,
            position: "relative",
            shadowColor: "#d4d4d4",
          },
          textInput: {
            backgroundColor: textInputBackgroundColor
              ? textInputBackgroundColor
              : "white",
            fontSize: 16,
            fontWeight: 600,
            marginTop: 5,
            width: "w-full",
            borderRadius: 200,
            overflow: "hidden",
            whiteSpace: "nowrap",
            ellipsizeMode: "tail",
          },
          listView: {
            backgroundColor: textInputBackgroundColor
              ? textInputBackgroundColor
              : "white",
            position: "relative",
            top: 0,
            width: "100%",
            borderRadius: 10,
            shadowColor: "#d4d4d4",
            zIndex: 99,
          },
        }}
        renderRow={(rowData) => {
          const title = rowData.structured_formatting.main_text;
          const address = rowData.structured_formatting.secondary_text;
          return (
            <View className="w-full">
              <Text>
                {title}
                {address && address.trim() !== "" ? `, ${address}` : ""}
              </Text>
            </View>
          );
        }}
        onPress={(data, details = null) => {
          handlePress({
            latitude: details?.geometry.location.lat!,
            longitude: details?.geometry.location.lng!,
            address: data.description,
            placeId: details?.place_id!,
          });
        }}
        query={{
          key: googlePlacesApiKey,
          language: "pt-BR",
          location:
            userLatitude && userLongitude
              ? `${userLatitude},${userLongitude}`
              : undefined,
          radius: 10000, // Raio de 2 km
        }}
        renderLeftButton={() => (
          <View className="justify-center items-center w-6 h-6">
            <Image
              source={icon ? icon : icons.search}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </View>
        )}
        textInputProps={{
          placeholderTextColor: "gray",
          placeholder: initialLocation ?? placeholder,
        }}
        enablePoweredByContainer={false}
      />
    </View>
  );
};

export default GoogleTextInput;
