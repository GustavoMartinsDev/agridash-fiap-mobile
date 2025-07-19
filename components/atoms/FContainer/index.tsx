import React from "react";
import { View as RNView, ViewProps as RNViewProps } from "react-native";
import { BaseComponentProps } from "../../../types";

export interface FContainerProps extends RNViewProps, BaseComponentProps {
  centered?: boolean;
  fullScreen?: boolean;
  padding?: "none" | "small" | "medium" | "large";
  background?: "primary" | "secondary" | "white" | "transparent";
}

const paddingClasses = {
  none: "",
  small: "p-2",
  medium: "p-4",
  large: "p-6",
};

const backgroundClasses = {
  primary: "bg-farm-green-50",
  secondary: "bg-farm-amber-100",
  white: "bg-white",
  transparent: "bg-transparent",
};

export const FContainer: React.FC<FContainerProps> = ({
  centered = false,
  fullScreen = false,
  padding = "none",
  background = "transparent",
  className = "",
  children,
  ...props
}) => {
  const classes = `
    ${fullScreen ? "flex-1" : ""} 
    ${centered ? "items-center justify-center" : ""} 
    ${paddingClasses[padding]} 
    ${backgroundClasses[background]} 
    ${className}
  `.trim();

  return (
    <RNView className={classes} {...props}>
      {children}
    </RNView>
  );
};
