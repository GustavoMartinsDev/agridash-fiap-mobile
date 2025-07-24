import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { FInput, FText, FInputProps } from "../../atoms";
import { BaseComponentProps } from "../../../types";

export interface FInputFieldProps
  extends Omit<FInputProps, "state">,
    BaseComponentProps {
  label?: string;
  error?: string;
  required?: boolean;
  showError?: boolean;
  showPasswordToggle?: boolean;
}

export const FInputField: React.FC<FInputFieldProps> = ({
  label,
  error,
  required = false,
  showError = true,
  showPasswordToggle = true,
  type,
  className = "",
  ...inputProps
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const hasError = Boolean(error);
  const inputState = hasError ? "error" : "default";
  const isPasswordField = type === "password";
  const actualType = isPasswordField && showPassword ? "text" : type;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View className={`mb-2 ${className}`}>
      {label && (
        <FText variant="body" color="secondary" className="mb-1">
          {label} {required && <FText color="error">*</FText>}
        </FText>
      )}
      <View className="relative">
        <FInput
          {...inputProps}
          type={actualType}
          state={inputState}
          hasRightIcon={isPasswordField && showPasswordToggle}
        />
        {isPasswordField && showPasswordToggle && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            className="absolute right-3 top-0 h-12 justify-center"
            activeOpacity={0.7}
          >
            <FText variant="body" className="text-neutral-500 text-lg">
              {showPassword ? "👁️‍🗨️" : "👁️"}
            </FText>
          </TouchableOpacity>
        )}
      </View>
      {hasError && showError && (
        <FText variant="error" color="error" className="mt-1">
          {error}
        </FText>
      )}
    </View>
  );
};
