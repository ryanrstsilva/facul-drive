import { Alert, Image, ScrollView, Text, View } from "react-native";
import { useState } from "react";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { images, icons } from "@/constants";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import OAuth from "@/components/OAuth";
import { signIn } from "@/service/auth";

const Login = () => {
  const [form, setForm] = useState({
    cpf: "41542533600",
    password: "Mudar@1234",
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const rawCpf = form.cpf.replace(/\D/g, "");
      // Chama a função signIn passando cpf e senha
      const result = await signIn(rawCpf, form.password);
      // Armazena o token e o refresh token no AsyncStorage
      await AsyncStorage.setItem("token", result.token);
      await AsyncStorage.setItem("refreshToken", result.refreshToken);

      // Navegação ou redirecionamento para outra tela
      Alert.alert("Login bem-sucedido", "Você está logado!");
      // return navigation.reset({ routes: [{ name: "BottomRoutes" }] });
      router.replace("/(root)/(tabs)/hitchhiking");
    } catch (error) {
      // Caso haja erro, exibe uma mensagem
      Alert.alert(
        "Erro",
        "Falha ao realizar login. Verifique suas credenciais..",
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
            Bem-vindo ao FaculDrive 👋
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="CPF"
            placeholder="Digite seu CPF"
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
            title={loading ? "Carregando..." : "Entrar"}
            onPress={handleLogin}
            className="mt-6"
          />

          <OAuth />

          <Link
            href="/register"
            className="text-lg text-center text-general-200 mt-10"
          >
            <Text>Ainda não tem uma conta? </Text>
            <Text className="text-primary-500">Cadastre-se</Text>
          </Link>
        </View>

        {/* Verification Modal */}
      </View>
    </ScrollView>
  );
};

export default Login;
