import React from "react";
import { View } from "react-native";
import { FInput, FText, FInputProps } from "../../atoms";
import { BaseComponentProps } from "../../../types";

export interface FInputFieldProps
  extends Omit<FInputProps, "state">,
    BaseComponentProps {
  label?: string;
  error?: string;
  required?: boolean;
  showError?: boolean;
}

export const FInputField: React.FC<FInputFieldProps> = ({
  label,
  error,
  required = false,
  showError = true,
  className = "",
  ...inputProps
}) => {
  const hasError = Boolean(error);
  const inputState = hasError ? "error" : "default";

  return (
    <View className={`mb-2 ${className}`}>
      {label && (
        <FText variant="body" color="secondary" className="mb-1">
          {label} {required && <FText color="error">*</FText>}
        </FText>
      )}
      <FInput {...inputProps} state={inputState} />
      {hasError && showError && (
        <FText variant="error" color="error" className="mt-1">
          {error}
        </FText>
      )}
    </View>
  );
};
