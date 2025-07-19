import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: any = null;
let auth: any = null;
let db: any = null;
let firebaseError: string | null = null;

try {
  const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;

  if (!apiKey || apiKey === "demo-api-key" || apiKey.trim() === "") {
    throw new Error("Firebase API key not configured");
  }

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error: any) {
  console.warn("Firebase configuration error:", error);

  if (
    error.message &&
    (error.message.includes("API key not valid") ||
      error.message.includes("badRequest"))
  ) {
    firebaseError =
      "Firebase API key is invalid. Please check your .env configuration.";
  } else if (error.message && error.message.includes("not configured")) {
    firebaseError = "Firebase not configured. Please set up your .env file.";
  } else {
    firebaseError =
      "Firebase configuration error. Please check your environment variables.";
  }
}

export { auth, db, firebaseError };
export default app;
