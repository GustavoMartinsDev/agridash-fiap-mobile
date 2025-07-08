import React, { useState } from "react";
import { View } from "react-native";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/dashboard";

export default function App() {
  const [tela, setTela] = useState<"login" | "register" | "dashboard">("login");

  return (
    <View style={{ flex: 1 }}>
      {tela === "login" ? (
        <Login
          irParaRegister={() => setTela("register")}
          irParaDashboard={() => setTela("dashboard")}
        />
      ) : tela === "register" ? (
        <Register irParaLogin={() => setTela("login")} />
      ) : (
        <Dashboard onLogout={() => setTela("login")} />
      )}
    </View>
  );
}
