import React from "react";
import { Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthTemplate, LoginForm } from "../components";
import { NavigationProps } from "../types";

export interface LoginPageProps extends NavigationProps {}

export const LoginPage: React.FC<LoginPageProps> = ({
  irParaRegister,
  irParaDashboard,
}) => {
  return (
    <AuthTemplate
      title={
        <LinearGradient
          colors={["#16a34a", "#0284c7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 8, padding: 4 }}
        >
          <Text className="text-6xl font-extrabold text-center text-white">
            AgriDash
          </Text>
        </LinearGradient>
      }
      subtitle="Gestão de Cooperativas Agrícolas"
      className="bg-bg-primary"
    >
      <LoginForm
        irParaRegister={irParaRegister}
        irParaDashboard={irParaDashboard}
      />
    </AuthTemplate>
  );
};
