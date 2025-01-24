import { ScrollView, View, Text, Image, Alert } from "react-native";
import { images, icons } from "@/constants";
import { useState } from "react";
import { router } from "expo-router";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { Link } from "expo-router";
import OAuth from "@/components/OAuth";
import { ReactNativeModal } from "react-native-modal";
import { signUp } from "@/service/auth";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    cpf: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const onSignUpPress = async () => {
    setLoading(true);
    try {
      // // Remove caracteres não numéricos do CPF
      // const rawCpf = form.cpf.replace(/\D/g, "");
      
      // Validações básicas
      if (!form.name.trim()) {
        throw new Error("Nome é obrigatório");
      }
      // if (rawCpf.length !== 11) {
      //   throw new Error("CPF inválido");
      // }
      if (form.password.length < 8) {
        throw new Error("Senha deve ter no mínimo 8 caracteres");
      }

      console.log("🚀 Iniciando cadastro...");

      // Chama a função de registro
      await signUp({
        name: form.name.trim(),
        cpf: form.cpf,
        password: form.password,
      });

      console.log("✅ Cadastro realizado com sucesso!");

      // Mostra modal de sucesso
      setVerification({ ...verification, state: "success" });

      // Aguarda 2 segundos antes de redirecionar
      setTimeout(() => {
        router.replace("/login");
      }, 2000);

    } catch (error: any) {
      console.error("❌ Erro no cadastro:", error);
      
      // Tenta extrair a mensagem de erro mais relevante
      let errorMessage = "Erro ao realizar cadastro. Tente novamente.";
      
      if (error.response?.data?.errors) {
        // Se houver erros específicos da API
        const errors = error.response.data.errors;
        errorMessage = Object.values(errors)
          .flat()
          .join('\n');
      } else if (error.response?.data?.message) {
        // Se houver uma mensagem de erro da API
        errorMessage = error.response.data.message;
      } else if (error.message) {
        // Se for um erro de validação local ou outro erro com mensagem
        errorMessage = error.message;
      }

      Alert.alert(
        "Erro no Cadastro", 
        errorMessage,
        [{ text: "OK", style: "default" }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Crie sua conta
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="Nome"
            placeholder="Digite seu nome"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
          <InputField
            label="Email"
            placeholder="Digite seu Email"
            icon={icons.email}
            value={form.cpf}
            onChangeText={(value) => setForm({ ...form, cpf: value })}
          />
          <InputField
            label="Senha"
            placeholder="Digite sua senha"
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <CustomButton
            title={loading ? "Cadastrando..." : "Cadastrar"}
            onPress={onSignUpPress}
            className="mt-6"
            disabled={loading}
          />

          <OAuth />

          <Link
            href="/login"
            className="text-lg text-center text-general-200 mt-10"
          >
            <Text>Já tem uma conta? </Text>
            <Text className="text-primary-500">Entre</Text>
          </Link>
        </View>

        <ReactNativeModal isVisible={verification.state === "success"}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default Register;
