import { auth } from "../firebase/firebase";
import { createContext, useContext, useEffect, useState } from "react";
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  User,
} from "firebase/auth";
import { LoginFormValues, UserFormValues } from "../../../shared/src/types";
import { useNavigate } from "react-router-dom";
import {
  firebaseSignIn,
  firebaseSignOut,
  firebaseSignUp,
} from "../firebase/AuthService";
import { FirebaseError } from "firebase/app";
import { Spinner } from "react-bootstrap";

export interface IAuth {
  user: User | null;
  loading: boolean;
  signIn: (creds: LoginFormValues) => void;
  signUp: (creds: UserFormValues) => void;
  signOut: () => void;
  showToast: boolean;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  toastMessage: string;
  setToastMessage: React.Dispatch<React.SetStateAction<string>>;
}

const AuthContext = createContext<IAuth>({
  user: auth.currentUser,
  loading: false,
  signIn: () => {},
  signUp: () => {},
  signOut: () => {},
  showToast: false,
  setShowToast: () => {},
  toastMessage: "",
  setToastMessage: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const errorHandling = (error: FirebaseError) => {
    switch (error?.code) {
      case "auth/invalid-email":
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
      case "auth/email-already-in-use":
        setToastMessage("Invalid email or password. Please try again.");
        setShowToast(true);
        break;
      case "auth/weak-password":
        setToastMessage("Passwords should be at least 6 characters long.");
        setShowToast(true);
        break;
      default:
        setToastMessage("Oops, something went wrong! Please try again later.");
        setShowToast(true);
    }
  };

  const signUp = (creds: UserFormValues) => {
    setIsLoading(true);
    firebaseSignUp(creds)
      .then(async (signUpResult) => {
        const { user } = signUpResult;
        if (user) {
          setCurrentUser(user);

          // Send the username to the backend after the user signs up
          const response = await fetch("http://localhost:5000/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: creds.username, // Assuming 'username' is part of 'creds'
              firebaseUserId: user.uid, // Store the Firebase user ID in case you need it
            }),
          });

          const data = await response.json();
          if (response.ok) {
            navigate("/upload", { replace: true });
          } else {
            setToastMessage(data.error || "Failed to save user data.");
            setShowToast(true);
          }
        } else {
          setToastMessage("Authentication failed. Please try again later.");
          setShowToast(true);
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
      .then((signInResult) => {
        const { user } = signInResult;
        if (user) {
          setCurrentUser(user);
          navigate("/upload", { replace: true });
        } else {
          setToastMessage("Authentication failed. Please try again later.");
          setShowToast(true);
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
      setCurrentUser(null);
      navigate("/", { replace: true });
    } catch (error) {
      setIsLoading(false);
      setToastMessage("Sign out failed. Please try again later.");
      setShowToast(true);
    }
  };

  //create Auth Values
  const authValues: IAuth = {
    user: currentUser,
    loading: isLoading,
    signIn,
    signUp,
    signOut,
    showToast,
    setShowToast,
    toastMessage,
    setToastMessage,
  };

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setCurrentUser(user);
          setIsAuthLoading(false);
          if (user) {
            navigate("/upload", { replace: true });
          }
        });
        return unsubscribe;
      })
      .catch(() => {
        setToastMessage("Persistence isn't saved.");
        setShowToast(true);
      });
  }, [auth, navigate]);

  if (isAuthLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
