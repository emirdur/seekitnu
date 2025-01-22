import { auth } from "../firebase/firebase";
import { createContext, useContext, useEffect, useState } from "react";
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  User,
} from "firebase/auth";
import {
  IAuth,
  LoginFormValues,
  UserFormValues,
} from "../../../shared/src/authTypes";
import {
  firebaseSignIn,
  firebaseSignOut,
  firebaseSignUp,
} from "../firebase/AuthService";
import { FirebaseError } from "firebase/app";
import { Loader } from "../components/Loader/Loader";
import { useImageUpload } from "./ImageUploadContext"; // Keeping this for checking image upload
import { useToast } from "./ToastContext";

const AuthContext = createContext<IAuth>({
  user: auth.currentUser,
  loading: false,
  signIn: () => {},
  signUp: () => {},
  signOut: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const { setHasUploadedImage, checkIfImageUploaded } = useImageUpload();
  const { showToast } = useToast();

  const errorHandling = (error: FirebaseError) => {
    switch (error?.code) {
      case "auth/invalid-email":
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
      case "auth/email-already-in-use":
        showToast("Invalid email or password. Please try again.", "danger");
        break;
      case "auth/weak-password":
        showToast("Passwords should be at least 6 characters long.", "danger");
        break;
      default:
        showToast(
          "Oops, something went wrong! Please try again later.",
          "danger",
        );
    }
  };

  const signUp = (creds: UserFormValues) => {
    setIsLoading(true);
    firebaseSignUp(creds)
      .then(async (signUpResult) => {
        const { user } = signUpResult;
        if (user) {
          // Send the username to the backend after the user signs up
          const response = await fetch("http://localhost:5000/users/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: creds.username,
              firebaseUid: user.uid,
            }),
          });

          const data = await response.json();
          if (response.ok) {
            setHasUploadedImage(null);
            setCurrentUser(user);
          } else {
            showToast(data.error || "Failed to save user data.", "danger");
          }
        } else {
          showToast("Authentication failed. Please try again later.", "danger");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        errorHandling(error);
        setIsLoading(false);
      });
  };

  const signIn = async (creds: LoginFormValues) => {
    setIsLoading(true);
    firebaseSignIn(creds)
      .then(async (signInResult) => {
        const { user } = signInResult;
        if (user) {
          await checkIfImageUploaded(user.uid);
          setCurrentUser(user);
        } else {
          showToast("Authentication failed. Please try again later.", "danger");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        errorHandling(error);
        setIsLoading(false);
      });
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut();
      setHasUploadedImage(null);
      setCurrentUser(null);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      showToast("Sign out failed. Please try again later.", "danger");
    }
  };

  // Create Auth Values
  const authValues: IAuth = {
    user: currentUser,
    loading: isLoading,
    signIn,
    signUp,
    signOut,
  };

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            await checkIfImageUploaded(user.uid); // Check image upload on auth state change
          }
          setCurrentUser(user);
          setIsAuthLoading(false);
        });
        return unsubscribe;
      })
      .catch(() => {
        showToast("Persistence isn't saved.", "danger");
      });
  }, [checkIfImageUploaded]);

  if (isAuthLoading) {
    return <Loader />; // Show a loading spinner until auth state is resolved
  }

  return (
    <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
