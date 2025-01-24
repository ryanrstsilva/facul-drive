import {
  KeyboardAvoidingView,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Text,
  Image,
  Platform,
  Keyboard,
  ViewStyle,
  TextStyle,
} from "react-native";
import { InputFieldProps } from "@/types/type";

interface ExtendedInputFieldProps extends InputFieldProps {
  error?: string,
  style?: ViewStyle;
}

const InputField = ({
  label,
  labelStyle,
  icon,
  secureTextEntry = false,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  error,
  style,
  ...props
}: ExtendedInputFieldProps) => (
  <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1}}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="my-2 w-full">
        <Text className={`text-lg font-JakartaSemiBold mb-3 ${labelStyle}`}>
          {label}
        </Text>
        <View
          className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border ${
            error
              ? 'border-red-500'
              : 'border-neutral-100 focus:border-primary-500'
        } ${containerStyle}`}
        >
          {icon && (
            <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />
          )}
          <TextInput
            className={`rounded-full p-4 font-JakartSemiBold text-[15px] flex-1 ${inputStyle} text-left`}
            secureTextEntry={secureTextEntry}
            {...props}
          />
        </View>
        {error && (
          <Text className="text-red-500 text-sm mt-1 ml-4">
            {error}
          </Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);

export default InputField;
