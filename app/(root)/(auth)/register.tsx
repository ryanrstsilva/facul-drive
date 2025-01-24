import { Alert, ScrollView, View, Text, TextStyle, Image } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Link } from "expo-router";
import { ReactNativeModal } from "react-native-modal";

import { images, icons } from "@/constants";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import OAuth from "@/components/OAuth";
import { signUp } from "@/service/auth";

const Register = () => {
  const [form, setForm] = useState({
    nomePessoa: "",
    matricula: "",
    userName: "",
    password: "",
    confirmPassword: "",
    telefone: "",
    email: "",
  });

  const [validations, setValidations] = useState({
    telefone: true,
    password: true,
    confirmPassword: true
  });

  const [loading, setLoading] = useState(false);
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

   // Validação de telefone
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Limit to 11 digits
    const truncated = cleaned.slice(0, 11);
    
    // Format based on length
    if (truncated.length <= 2) {
      return truncated;
    } else if (truncated.length <= 6) {
      return `(${truncated.slice(0, 2)}) ${truncated.slice(2)}`;
    } else if (truncated.length <= 10) {
      return `(${truncated.slice(0, 2)}) ${truncated.slice(2, 6)}-${truncated.slice(6)}`;
    } else {
      return `(${truncated.slice(0, 2)}) ${truncated.slice(2, 7)}-${truncated.slice(7)}`;
    }
  };

  // Handle phone number input
  const handlePhoneInput = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setForm({ ...form, telefone: formatted });
    
    // Validate phone number (must be 11 digits after formatting)
    const digitsOnly = formatted.replace(/\D/g, '');
    setValidations({
      ...validations,
      telefone: digitsOnly.length === 11
    });
  };

  // Handle password confirmation
  const handlePasswordConfirmation = (value: string) => {
    setForm({ ...form, confirmPassword: value });
    
    // Check if passwords match
    setValidations({
      ...validations,
      confirmPassword: value === form.password,
      password: form.password.length >= 8
    });
  };

  // Handle password input
  const handlePasswordInput = (value: string) => {
    setForm({ ...form, password: value });
    
    // Validate password length
    setValidations({
      ...validations,
      password: value.length >= 8,
      // Reset confirm password validation when main password changes
      confirmPassword: value === form.confirmPassword
    });
  };

  const onSignUpPress = async () => {
    setLoading(true);
    try {
      const rawMatricula = form.matricula.replace(/\D/g, "");

      // Validações Básicas
      if (!form.nomePessoa.trim()) {
        throw new Error("Nome é obrigatório.");
      }

      if (rawMatricula.length !== 11) {
        throw new Error("Formato de matrícula inválida (11 caracteres numéricos).");
      }

      if (!form.email.trim()) {
        throw new Error("Email é obrigatório.");
      }

      if (!validations.telefone) {
        throw new Error("Telefone inválido. Digite 11 dígitos.");
      }

      if (!validations.password) {
        throw new Error("Senha deve ter no mínimo 8 caracteres.");
      }

      if (!validations.confirmPassword) {
        throw new Error("As senhas não correspondem.");
      }

      console.log("🚀 Iniciando cadastro...");

      // Chama a função de registro
      await signUp({
        nomePessoa: form.nomePessoa.trim(),
        matricula: form.matricula.trim(),
        password: form.password.trim(),
        confirmPassword: form.confirmPassword.trim(),
        telefone: form.telefone.trim(),
        email: form.email.trim(),
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

  const getInputStyle = (isValid: boolean): { borderColor: string } => ({
    borderColor: isValid ? '#D1D5DB' : '#EF4444'
  });

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
            placeholder="Nome"
            icon={icons.person}
            value={form.nomePessoa}
            onChangeText={(value) => setForm({ ...form, nomePessoa: value })}
          />

          {/* userName e Email */}
          <InputField
            label="Email"
            placeholder="Email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />

          <InputField
            label="Telefone"
            placeholder="(31) 91234-1234"
            icon={icons.phone}
            value={form.telefone}
            onChangeText={(value) => setForm({ ...form, telefone: value })}
          />

          <InputField
            label="Matrícula"
            placeholder="Matrícula"
            icon={icons.person}
            value={form.matricula}
            onChangeText={(value) => setForm({ ...form, matricula: value })}
          />

          <InputField
            label="Senha"
            placeholder="Senha"
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <InputField
            label="Confirme sua senha"
            placeholder="Senha"
            icon={icons.lock}
            secureTextEntry={true}
            value={form.confirmPassword}
            onChangeText={(value) => setForm({ ...form, confirmPassword: value })}
          />

          <CustomButton
            title={loading ? "Cadastrando..." : "Cadastrar"}
            onPress={onSignUpPress}
            className="mt-6"
            disabled={loading}
          />

          {/* <OAuth /> */}

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
            <Text>Confirme seu Email!</Text>
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default Register;
