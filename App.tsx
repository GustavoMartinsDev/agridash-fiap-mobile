import React, { useState } from "react";
import { View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { LoginPage, RegisterPage, DashboardPage } from "./pages";
import { ScreenType } from "./types";
import { AuthProvider } from "./context/AuthContext";
import "./global.css";

export default function App() {
  const [tela, setTela] = useState<ScreenType>("login");

  return (
    <PaperProvider>
      <AuthProvider>
        <View className="flex-1">
          {tela === "login" ? (
            <LoginPage
              irParaRegister={() => setTela("register")}
              irParaDashboard={() => setTela("dashboard")}
            />
          ) : tela === "register" ? (
            <RegisterPage irParaLogin={() => setTela("login")} />
          ) : (
            <DashboardPage onLogout={() => setTela("login")} />
          )}
        </View>
      </AuthProvider>
    </PaperProvider>
  );
}
