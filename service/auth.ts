import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "./api";

interface SignUpPayload {
  nomePessoa: string,
  matricula: string,
  password: string,
  confirmPassword: string,
  telefone: string,
  email: string,
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
    nomePessoa,
    matricula,
    password,
    confirmPassword,
    telefone,
    email,
}: SignUpPayload): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const payload = {
      nomePessoa: nomePessoa,
      matricula: matricula,
      userName: email,
      password: password,
      confirmPassword: confirmPassword,
      role: "string",
      email: email,
      telefone: telefone,
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
