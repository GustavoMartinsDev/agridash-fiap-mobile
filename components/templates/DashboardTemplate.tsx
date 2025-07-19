import React from "react";
import { SafeAreaView, StatusBar, ScrollView, Platform } from "react-native";
import { FContainer, FButton } from "../atoms";
import { Header } from "../molecules";
import { NavigationProps, BaseComponentProps } from "../../types";

export interface DashboardTemplateProps
  extends NavigationProps,
    BaseComponentProps {
  title: string;
  children: React.ReactNode;
  showLogout?: boolean;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  title,
  children,
  onLogout,
  showLogout = true,
  className = "",
}) => {
  return (
    <SafeAreaView className={`flex-1 bg-farm-green-50 ${className}`}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "default"}
        backgroundColor="#e6f2d6"
      />
      <ScrollView
        className="flex-1 bg-farm-green-50"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <FContainer padding="medium">
          <Header
            title={title}
            rightComponent={
              showLogout && onLogout ? (
                <FButton
                  variant="danger"
                  size="small"
                  onPress={onLogout}
                  className="py-2 px-4"
                >
                  Logout
                </FButton>
              ) : undefined
            }
          />
          {children}
        </FContainer>
      </ScrollView>
    </SafeAreaView>
  );
};
