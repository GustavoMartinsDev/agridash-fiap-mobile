import React, { useState } from "react";
import { View } from "react-native";
import { LoginPage, RegisterPage, DashboardPage } from "./pages";
import { ScreenType } from "./types";
import "./global.css";

export default function App() {
  const [tela, setTela] = useState<ScreenType>("login");

  return (
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
  );
}
