import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
} from "react-native";
import { BaseComponentProps, ButtonVariant, ButtonSize } from "../../../types";
import { FText } from "../FText";

export interface FButtonProps
  extends TouchableOpacityProps,
    BaseComponentProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantClasses = {
  primary: "bg-farm-green-800",
  secondary: "bg-farm-amber-400",
  danger: "bg-farm-red-600",
};

const sizeClasses = {
  small: "h-10 px-4",
  medium: "h-12 px-6",
  large: "h-14 px-8",
};

const disabledClasses = "bg-farm-amber-400 opacity-60";

export const FButton: React.FC<FButtonProps> = ({
  variant = "primary",
  size = "medium",
  loading = false,
  fullWidth = false,
  disabled = false,
  className = "",
  children,
  ...props
}) => {
  const isDisabled = disabled || loading;

  const classes = `
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${fullWidth ? "w-full" : ""} 
    ${isDisabled ? disabledClasses : ""} 
    rounded-lg items-center justify-center 
    ${className}
  `.trim();

  return (
    <TouchableOpacity className={classes} disabled={isDisabled} {...props}>
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <FText variant="body" color="white" className="font-bold">
          {children}
        </FText>
      )}
    </TouchableOpacity>
  );
};
