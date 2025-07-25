import React from "react";
import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthTemplate, RegisterForm } from "../components";
import { NavigationProps } from "../types";
import { theme } from "../ui";

export interface RegisterPageProps extends NavigationProps {}

export const RegisterPage: React.FC<RegisterPageProps> = ({ irParaLogin }) => {
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[
          theme.colors.blue[50],
          theme.colors.blue[100],
          theme.colors.blue[200],
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
      />

      <AuthTemplate
        title={
          <View style={{ marginBottom: 8 }}>
            <LinearGradient
              colors={[theme.colors.green[600], theme.colors.blue[600]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 16,
                padding: 12,
                shadowColor: theme.colors.black,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 36,
                  fontWeight: "900",
                  textAlign: "center",
                  color: "white",
                  letterSpacing: 1,
                }}
              >
                Cadastro
              </Text>
            </LinearGradient>
          </View>
        }
        subtitle="Crie sua conta e faça parte!"
        className="bg-transparent"
      >
        <RegisterForm irParaLogin={irParaLogin} />
      </AuthTemplate>
    </View>
  );
};
