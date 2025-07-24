import React from "react";
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
} from "react-native";
import { BaseComponentProps, InputType, InputState } from "../../../types";

export interface FInputProps extends RNTextInputProps, BaseComponentProps {
  type?: InputType;
  state?: InputState;
  fullWidth?: boolean;
  hasRightIcon?: boolean;
}

const stateClasses = {
  default: "border-farm-amber-400",
  error: "border-farm-red-600",
  success: "border-green-500",
};

export const FInput: React.FC<FInputProps> = ({
  type = "text",
  state = "default",
  fullWidth = true,
  hasRightIcon = false,
  className = "",
  ...props
}) => {
  const classes = `
    ${fullWidth ? "w-full" : ""} 
    h-12 bg-white border rounded-lg text-base text-farm-green-800 
    ${hasRightIcon ? "pl-4 pr-12" : "px-4"}
    ${stateClasses[state]} 
    ${className}
  `.trim();

  const getKeyboardType = () => {
    switch (type) {
      case "email":
        return "email-address";
      case "number":
        return "numeric";
      default:
        return "default";
    }
  };

  const getSecureTextEntry = () => {
    return type === "password";
  };

  const getAutoCapitalize = () => {
    return type === "email" ? "none" : "sentences";
  };

  return (
    <RNTextInput
      className={classes}
      keyboardType={getKeyboardType()}
      secureTextEntry={getSecureTextEntry()}
      autoCapitalize={getAutoCapitalize()}
      placeholderTextColor="#7c6f57"
      {...props}
    />
  );
};
