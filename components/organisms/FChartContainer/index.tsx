import React from "react";
import { Dimensions } from "react-native";
import { FContainer } from "../../atoms";
import { ChartData, BaseComponentProps } from "../../../types";

const screenWidth = Dimensions.get("window").width;

export interface FChartContainerProps extends BaseComponentProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
}

export const FChartContainer: React.FC<FChartContainerProps> = ({
  children,
  width = screenWidth - 32,
  height = 180,
  className = "",
}) => {
  return (
    <FContainer className={`self-center mb-2 ${className}`}>
      {children}
    </FContainer>
  );
};
