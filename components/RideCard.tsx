import { Image, Text, View } from "react-native";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { decode } from "@mapbox/polyline";

import { icons } from "@/constants";
import { OfertaCarona } from "@/global/ofertaCarona";

const RideCard = ({ ride }: { ride: OfertaCarona }) => {
  const [polylinePoints, setPolylinePoints] = useState<string>("");
  const [originCoords, setOriginCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [destCoords, setDestCoords] = useState<{ lat: number; lng: number } | null>(null);
  
  const origin = ride.saida.split("|")[1];
  const destination = ride.destino.split("|")[1];
  const googleApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

    useEffect(() => {
    getDirections();
  }, []);

  const getDirections = async () => {
    try {
      const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${origin}&destination=place_id:${destination}&key=${googleApiKey}`;

      const result = await fetch(apiUrl);
      const json = await result.json();

      if (!json.routes[0]) {
        throw new Error('Não foi possível encontrar uma rota');
      }

      // Obtém a polyline codificada diretamente da resposta
      const encodedPolyline = json.routes[0].overview_polyline.points;
      setPolylinePoints(encodedPolyline);

      // Armazena as coordenadas de origem e destino da rota
      const leg = json.routes[0].legs[0];
      setOriginCoords({
        lat: leg.start_location.lat,
        lng: leg.start_location.lng
      });
      setDestCoords({
        lat: leg.end_location.lat,
        lng: leg.end_location.lng
      });
      
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const getStaticMapUrl = () => {
    if (!originCoords || !destCoords) return '';
    
    const baseUrl = "https://maps.googleapis.com/maps/api/staticmap";
    const size = "300x300";
    const scale = "2";
   
    const paramsObj: Record<string, string> = {
      size,
      scale,
      key: googleApiKey || "",
      path: `color:0x2563eb|weight:5|enc:${polylinePoints}`, // Cor azul mais bonita
      markers: [
        `color:green|label:A|${originCoords.lat},${originCoords.lng}`,
        `color:red|label:B|${destCoords.lat},${destCoords.lng}`
      ].join('&markers='),
      zoom: "auto" // Ajusta o zoom automaticamente para mostrar toda a rota
    };

    const params = new URLSearchParams(paramsObj);
    return `${baseUrl}?${params.toString()}`;
  };

  
  return (
    <View className="flex flex-row items-center justify-center bg-transparent rounded-lg shadow-sm shadow-neutral-300 mb-3">
      <View className="flex flex-col items-center justify-center p-3 ">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-col mx-5 gap-y-5 flex-1">
            {/* Origin */}
            <View className="flex flex-row items-center gap-x-2">
              <Image source={icons.to} className="w-5 h-5" />
              <Text className="text-md font-JakartaMedium" numberOfLines={2}>
                {ride.saida.split("|")[0]}
              </Text>
            </View>

            {/* Destination */}
            <View className="flex flex-row items-center gap-x-2">
              <Image source={icons.point} className="w-5 h-5" />
              <Text className="text-md font-JakartaMedium" numberOfLines={2}>
                {ride.destino.split("|")[0]}
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
