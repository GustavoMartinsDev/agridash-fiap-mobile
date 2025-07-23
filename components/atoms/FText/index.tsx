import React from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";
import { BaseComponentProps } from "../../../types";

export interface FTextProps extends RNTextProps, BaseComponentProps {
  variant?: "title" | "subtitle" | "body" | "caption" | "error";
  color?: "primary" | "secondary" | "error" | "success" | "white";
  children: React.ReactNode;
}

const variantClasses = {
  title: "text-3xl font-bold",
  subtitle: "text-lg",
  body: "text-base",
  caption: "text-sm",
  error: "text-sm",
};

const colorClasses = {
  primary: "text-success-800",
  secondary: "text-neutral-600",
  error: "text-danger-600",
  success: "text-success-600",
  white: "text-white",
};

export const FText: React.FC<FTextProps> = ({
  variant = "body",
  color = "primary",
  className = "",
  children,
  ...props
}) => {
  const classes = `${variantClasses[variant]} ${colorClasses[color]} ${className}`;

  return (
    <RNText className={classes} {...props}>
      {children}
    </RNText>
  );
};
