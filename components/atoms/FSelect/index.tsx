import React from "react";
import { TouchableOpacity, ScrollView } from "react-native";
import { FContainer, FText } from "../../atoms";
import { BaseComponentProps } from "../../../types";

export interface FSelectOption {
  label: string;
  value: string;
}

export interface FSelectProps extends BaseComponentProps {
  options: FSelectOption[];
  value?: string;
  placeholder?: string;
  onSelect: (value: string) => void;
  error?: string;
}

export const FSelect: React.FC<FSelectProps> = ({
  options,
  value,
  placeholder = "Selecione...",
  onSelect,
  error,
  className = "",
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <FContainer className={className}>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        className={`border border-farm-green-200 rounded-lg p-3 ${
          error ? "border-farm-red-600" : ""
        }`}
      >
        <FText color={selectedOption ? "primary" : "secondary"}>
          {selectedOption ? selectedOption.label : placeholder}
        </FText>
      </TouchableOpacity>

      {isOpen && (
        <FContainer className="border border-farm-green-200 rounded-lg mt-1 max-h-40 bg-white">
          <ScrollView>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => {
                  onSelect(option.value);
                  setIsOpen(false);
                }}
                className="p-3 border-b border-farm-green-100"
              >
                <FText color="primary">{option.label}</FText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </FContainer>
      )}

      {error && (
        <FText variant="error" color="error" className="mt-1">
          {error}
        </FText>
      )}
    </FContainer>
  );
};
