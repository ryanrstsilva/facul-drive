import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "./api";

interface SignInResult {
  token: string;
  refreshToken: string;
}
interface RestoreTokenResult {
  token: string;
  refreshToken: string;
  message: string;
}
export const signIn = (cpf: string, senha: string): Promise<SignInResult> => {
  return new Promise((resolve, reject) => {
    const payload = {
      userName: cpf,
      password: senha,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    api
      .post<SignInResult>("api/auth/login", payload, config)
      .then((response) => {
        if (response.data && response.ok) {
          resolve(response.data);
        }
        reject(response.data);
      })
      .catch((error) => reject(error));
  });
};

export const restoreToken = (
  token: string,
  refreshToken: string,
): Promise<RestoreTokenResult> => {
  return new Promise((resolve, reject) => {
    const payload = {
      token: token,
      refreshToken: refreshToken,
    };
    api
      .post<RestoreTokenResult>("api/auth/refreshtoken", payload)
      .then((response) => {
        if (response.data && response.ok) {
          resolve(response.data);
        }
        reject(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
