import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { FContainer, FText } from "../../atoms";

export interface PasswordStrengthProps {
  password: string;
  isValid: boolean;
  details?: {
    comprimento: boolean;
    maiuscula: boolean;
    minuscula: boolean;
    numero: boolean;
    especial: boolean;
  };
}

export const FPasswordStrength: React.FC<PasswordStrengthProps> = ({
  password,
  isValid,
  details,
}) => {
  if (!password || !details) return null;

  const getStrengthInfo = () => {
    const validCriteria = Object.values(details).filter(Boolean).length;

    if (isValid) {
      return {
        label: "FORTE",
        color: "text-success-600",
        bgColor: "bg-success-500",
      };
    } else if (validCriteria >= 3) {
      return {
        label: "MÉDIA",
        color: "text-warning-600",
        bgColor: "bg-warning-500",
      };
    } else {
      return {
        label: "FRACA",
        color: "text-danger-600",
        bgColor: "bg-danger-500",
      };
    }
  };

  const strengthInfo = getStrengthInfo();
  const validCriteria = Object.values(details).filter(Boolean).length;

  return (
    <FContainer className="mt-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200 mb-3">
      <FText variant="caption" className="text-neutral-600 font-semibold mb-2">
        Força da Senha:
      </FText>

      <FContainer className="space-y-1">
        <FContainer className="flex-row items-center">
          <Icon
            name={details.comprimento ? "checkmark-circle" : "close-circle"}
            size={16}
            color={details.comprimento ? "#059669" : "#dc2626"}
            style={{ marginRight: 6 }}
          />
          <FText
            variant="caption"
            className={
              details.comprimento ? "text-success-600" : "text-danger-600"
            }
          >
            Mínimo 6 caracteres
          </FText>
        </FContainer>

        <FContainer className="flex-row items-center">
          <Icon
            name={details.maiuscula ? "checkmark-circle" : "close-circle"}
            size={16}
            color={details.maiuscula ? "#059669" : "#dc2626"}
            style={{ marginRight: 6 }}
          />
          <FText
            variant="caption"
            className={
              details.maiuscula ? "text-success-600" : "text-danger-600"
            }
          >
            Letra maiúscula (A-Z)
          </FText>
        </FContainer>

        <FContainer className="flex-row items-center">
          <Icon
            name={details.minuscula ? "checkmark-circle" : "close-circle"}
            size={16}
            color={details.minuscula ? "#059669" : "#dc2626"}
            style={{ marginRight: 6 }}
          />
          <FText
            variant="caption"
            className={
              details.minuscula ? "text-success-600" : "text-danger-600"
            }
          >
            Letra minúscula (a-z)
          </FText>
        </FContainer>

        <FContainer className="flex-row items-center">
          <Icon
            name={details.numero ? "checkmark-circle" : "close-circle"}
            size={16}
            color={details.numero ? "#059669" : "#dc2626"}
            style={{ marginRight: 6 }}
          />
          <FText
            variant="caption"
            className={details.numero ? "text-success-600" : "text-danger-600"}
          >
            Número (0-9)
          </FText>
        </FContainer>

        <FContainer className="flex-row items-center">
          <Icon
            name={details.especial ? "checkmark-circle" : "close-circle"}
            size={16}
            color={details.especial ? "#059669" : "#dc2626"}
            style={{ marginRight: 6 }}
          />
          <FText
            variant="caption"
            className={
              details.especial ? "text-success-600" : "text-danger-600"
            }
          >
            Caractere especial (!@#$...)
          </FText>
        </FContainer>
      </FContainer>

      <FContainer className="mt-3">
        <FContainer className="flex-row items-center mb-1">
          <FText variant="caption" className="text-neutral-600 mr-2">
            Força:
          </FText>
          <FText
            variant="caption"
            className={`${strengthInfo.color} font-bold`}
          >
            {strengthInfo.label}
          </FText>
        </FContainer>

        <FContainer className="h-2 bg-neutral-200 rounded-full overflow-hidden">
          <FContainer
            className={`h-full rounded-full ${strengthInfo.bgColor}`}
            style={{
              width: `${(validCriteria / 5) * 100}%`,
            }}
          />
        </FContainer>
      </FContainer>
    </FContainer>
  );
};
