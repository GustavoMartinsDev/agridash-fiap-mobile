import React from "react";
import { StatusBar } from "expo-status-bar";
import { FContainer, FText } from "../atoms";
import { Header } from "../molecules";
import { BaseComponentProps } from "../../types";

export interface AuthTemplateProps extends BaseComponentProps {
  title: string | React.ReactNode;
  subtitle: string;
  children: React.ReactNode;
}

export const AuthTemplate: React.FC<AuthTemplateProps> = ({
  title,
  subtitle,
  children,
  className = "",
}) => {
  return (
    <FContainer
      fullScreen
      centered
      background="primary"
      padding="large"
      className={className}
    >
      <Header title={title} subtitle={subtitle} className="mb-8" />
      {children}
      <StatusBar style="auto" />
    </FContainer>
  );
};
