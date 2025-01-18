import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "./api";

interface SignUpPayload {
  name: string;
  cpf: string;
  password: string;
}

interface SignInResult {
  token: string;
  refreshToken: string;
}

interface RestoreTokenResult {
  token: string;
  refreshToken: string;
  message: string;
}

export const signUp = ({
  name,
  cpf,
  password,
}: SignUpPayload): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const payload = {
      nomePessoa: name,
      matricula: cpf,
      userName: cpf,
      password: password,
      confirmPassword: password,
      role: "string",
    };
    
    console.log("📝 Payload do registro:", payload);

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    api
      .post("api/auth/register", payload, config)
      .then((response) => {
        console.log("✅ Resposta do servidor:", response);
        if (response.ok) {
          resolve(true);
        } else {
          console.error("❌ Erro na resposta:", response);
          reject(new Error("Erro no cadastro. Por favor, tente novamente."));
        }
      })
      .catch((error) => {
        console.error("❌ Erro na requisição:", error);
        console.error("Detalhes do erro:", {
          response: error.response?.data,
          status: error.response?.status,
          message: error.message
        });
        reject(error);
      });
  });
};

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
