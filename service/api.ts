import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { create } from "apisauce";

import { API_URL } from "@/constants/env";
import { RestoreTokenResult } from "@/global/auth";

const api = create({
  baseURL: API_URL.PROD,
});

api.axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Erro ao recuperar o token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.axiosInstance.interceptors.response.use(
  (response) => response, // Deixe as respostas bem-sucedidas passarem diretamente
  async (error) => {
    const originalRequest = error.config;
    const navigation = useNavigation<NavigationProp<any>>();
    // Verifica se é um erro 401 e se já não tentamos atualizar o token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const token = await AsyncStorage.getItem("token");
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        if (token && refreshToken) {
          const payload = { token, refreshToken };

          const refreshResponse = await api.post<RestoreTokenResult>(
            "api/auth/refreshtoken",
            payload,
          );

          if (refreshResponse.ok && refreshResponse.data) {
            // Atualiza os tokens no AsyncStorage
            await AsyncStorage.setItem("token", refreshResponse.data.token);
            await AsyncStorage.setItem(
              "refreshToken",
              refreshResponse.data.refreshToken,
            );

            // Atualiza o cabeçalho da requisição original com o novo token
            originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;

            // Refaça a requisição original
            return api.axiosInstance.request(originalRequest);
          }
        }
      } catch (refreshError) {
        return navigation.reset({ routes: [{ name: "Login" }] });
        console.error("Erro ao tentar atualizar o token:", refreshError);
      }
    }
    return Promise.reject(error);
  },
);
export { api };

export default api;
