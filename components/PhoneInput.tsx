import React, { useState } from 'react';
import { 
  TextInput, 
  KeyboardTypeOptions 
} from 'react-native';

// Função de máscara para telefone
export const phoneMask = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length <= 2) {
    return cleaned;
  } else if (cleaned.length <= 6) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  } else if (cleaned.length <= 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  } else {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  }
};

const PhoneInput = ({ 
  value, 
  onChangeText, 
  ...props 
}) => {
  return (
    <TextInput
      keyboardType="numeric"  // Teclado numérico
      maxLength={15}           // Limita comprimento máximo
      value={phoneMask(value)}
      onChangeText={(masked) => {
        const unmasked = masked.replace(/\D/g, '');
        onChangeText(unmasked);
      }}
      {...props}
    />
  );
};

export default PhoneInput;