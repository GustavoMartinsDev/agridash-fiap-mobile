import React from "react";
import { TouchableOpacity } from "react-native";
import { FText } from "../../atoms";
import { BaseComponentProps } from "../../../types";

export interface FLinkButtonProps extends BaseComponentProps {
  onPress: () => void;
  children: React.ReactNode;
  color?: "primary" | "secondary";
  underline?: boolean;
}

export const FLinkButton: React.FC<FLinkButtonProps> = ({
  onPress,
  children,
  color = "primary",
  underline = true,
  className = "",
}) => {
  return (
    <TouchableOpacity className={className} onPress={onPress}>
      <FText color={color} className={underline ? "underline" : ""}>
        {children}
      </FText>
    </TouchableOpacity>
  );
};
