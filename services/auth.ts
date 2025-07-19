import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { User } from "../types";

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email!,
    };
  },

  async register(email: string, password: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email!,
    };
  },

  async logout(): Promise<void> {
    await signOut(auth);
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        callback({
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
        });
      } else {
        callback(null);
      }
    });
  },

  getCurrentUser(): User | null {
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
      };
    }
    return null;
  },
};
