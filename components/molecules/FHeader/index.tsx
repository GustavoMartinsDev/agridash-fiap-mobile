import React from "react";
import { FContainer, FText } from "../../atoms";
import { BaseComponentProps } from "../../../types";

export interface FHeaderProps extends BaseComponentProps {
  title: string;
  subtitle?: string;
  rightComponent?: React.ReactNode;
}

export const FHeader: React.FC<FHeaderProps> = ({
  title,
  subtitle,
  rightComponent,
  className = "",
}) => {
  return (
    <FContainer
      className={`flex-row items-center justify-between mb-2 ${className}`}
    >
      <FContainer>
        <FText variant="title" color="primary" className="mb-0 self-start">
          {title}
        </FText>
        {subtitle && (
          <FText variant="subtitle" color="secondary">
            {subtitle}
          </FText>
        )}
      </FContainer>
      {rightComponent && <FContainer>{rightComponent}</FContainer>}
    </FContainer>
  );
};
