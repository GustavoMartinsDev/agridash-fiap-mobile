import React from "react";
import { FContainer, FText } from "../../atoms";
import { firebaseError } from "../../../config/firebase";

interface FFirebaseWarningProps {
  className?: string;
}

export const FFirebaseWarning: React.FC<FFirebaseWarningProps> = ({
  className = "",
}) => {
  if (!firebaseError) return null;

  return (
    <FContainer
      className={`p-4 m-4 bg-yellow-100 border border-yellow-300 rounded-lg ${className}`}
    >
      <FText variant="subtitle" color="error" className="mb-2 text-center">
        ⚠️ Firebase Configuration Issue
      </FText>
      <FText variant="body" color="secondary" className="mb-3 text-center">
        {firebaseError}
      </FText>
      <FText variant="caption" color="secondary" className="text-center">
        The app will work in demo mode with limited functionality. Please check
        your .env file and Firebase configuration.
      </FText>
    </FContainer>
  );
};
