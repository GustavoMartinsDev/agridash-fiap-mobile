import React from "react";
import { FContainer, FText } from "../../atoms";
import { BaseComponentProps } from "../../../types";

export interface FSectionProps extends BaseComponentProps {
  title: string;
  children: React.ReactNode;
  spacing?: "small" | "medium" | "large";
}

const spacingClasses = {
  small: "mt-4 mb-2",
  medium: "mt-6 mb-2",
  large: "mt-8 mb-4",
};

export const FSection: React.FC<FSectionProps> = ({
  title,
  children,
  spacing = "medium",
  className = "",
}) => {
  return (
    <FContainer className={className}>
      <FText
        variant="subtitle"
        color="secondary"
        className={`text-xl font-bold ${spacingClasses[spacing]}`}
      >
        {title}
      </FText>
      <FContainer className="mt-2">{children}</FContainer>
    </FContainer>
  );
};
