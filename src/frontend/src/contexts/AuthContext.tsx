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
} from "../../../shared/src/types/authTypes";
import {
  firebaseSignIn,
  firebaseSignOut,
  firebaseSignUp,
} from "../firebase/AuthService";
import { FirebaseError } from "firebase/app";
import { Loader } from "../components/Loader/Loader";
import { useImageUpload } from "./ImageUploadContext";
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

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            setCurrentUser(user);
            try {
              await checkIfImageUploaded(user.uid);
            } catch (error) {
              console.error("Failed to verify image upload:", error);
            }
          } else {
            setCurrentUser(null);
            setHasUploadedImage(null);
          }
          setIsAuthLoading(false);
        });
        return unsubscribe;
      })
      .catch(() => {
        showToast("Persistence isn't saved.", "danger");
      });
  }, [checkIfImageUploaded]);

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

  const checkUsernameAvailability = async (username: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/checkUsername/${username}`,
      );
      const data = await response.json();
      return data.available;
    } catch (error) {
      throw new Error(
        "Error checking username availability. Please try again.",
      );
    }
  };

  const handleSignupError = (data: any) => {
    if (data.error === "Display name is already taken.") {
      showToast(
        "This username is already taken. Please choose another one.",
        "danger",
      );
    } else {
      showToast(data.error || "Failed to save user data.", "danger");
    }
  };

  const signUp = async (creds: UserFormValues) => {
    setIsLoading(true);

    try {
      const isUsernameAvailable = await checkUsernameAvailability(
        creds.username,
      );

      if (!isUsernameAvailable) {
        showToast(
          "This username is already taken. Please choose another one.",
          "danger",
        );
        setIsLoading(false);
        return;
      }

      const signUpResult = await firebaseSignUp(creds);
      const { user } = signUpResult;

      if (user) {
        const response = await fetch("http://localhost:5000/api/users/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
          handleSignupError(data);
        }
      } else {
        showToast("Authentication failed. Please try again later.", "danger");
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        errorHandling(error);
      } else {
        showToast("An unknown error occurred. Please try again.", "danger");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserInDatabase = async (firebaseUid: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${firebaseUid}`,
      );
      if (response.status === 200) {
        const data = await response.json();
        return data.exists;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const signIn = async (creds: LoginFormValues) => {
    setIsLoading(true);

    try {
      const signInResult = await firebaseSignIn(creds);
      const { user } = signInResult;

      if (user) {
        const userExists = await checkUserInDatabase(user.uid);

        if (userExists) {
          await checkIfImageUploaded(user.uid);
          setCurrentUser(user);
        } else {
          showToast("User does not exist in the database.", "danger");
          await firebaseSignOut();
        }
      } else {
        showToast("Authentication failed. Please try again later.", "danger");
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        errorHandling(error);
      } else {
        showToast("Something went wrong. Please try again later.", "danger");
      }
    } finally {
      setIsLoading(false);
    }
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

  const authValues: IAuth = {
    user: currentUser,
    loading: isLoading,
    signIn,
    signUp,
    signOut,
  };

  if (isAuthLoading) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
