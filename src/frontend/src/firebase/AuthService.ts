import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";
import { LoginFormValues, UserFormValues } from "../../../shared/src/authTypes";

export const firebaseSignIn = async ({ email, password }: LoginFormValues) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result;
};

export const firebaseSignUp = async ({ email, password }: UserFormValues) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result;
};

export const firebaseSignOut = async () => {
  await signOut(auth);
};
