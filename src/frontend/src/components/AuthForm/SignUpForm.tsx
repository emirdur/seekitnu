import React, { useState } from "react";
import { SignUpFormProps } from "../../../../shared/src/types/authTypes";
import { useAuth } from "../../contexts/AuthContext";
import "./AuthForm.css";
import { Container, Button, Form } from "react-bootstrap";
import { useToast } from "../../contexts/ToastContext";

export const SignUpForm: React.FC<SignUpFormProps> = ({ setAuthType }) => {
  const { signUp, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { showToast } = useToast();

  const handleSignUp = async () => {
    if (!username || !email || !password || !confirmPassword) {
      showToast("Please fill in all fields.", "danger");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match. Please try again.", "danger");
      return;
    }

    try {
      await signUp({ email, password, username });
    } catch (error) {
      showToast("Sign up failed. Please try again later.", "danger");
    }
  };

  return (
    <Container fluid className="login-container">
      <div className="login-box">
        <h1 className="title">SeekIt</h1>
        <p className="subtitle">
          Sign up to join college students seeking for the image of the day.
        </p>
        <Form>
          <Form.Group controlId="formDisplayName" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Display Name"
              className="input-field"
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Control
              type="email"
              placeholder="Email"
              className="input-field"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Control
              type="password"
              placeholder="Password"
              className="input-field"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formConfirmPassword" className="mb-3">
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              className="input-field"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
          <Button className="login-btn" onClick={handleSignUp}>
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
          <div className="divider"></div>
          <Button
            className="signup-btn"
            variant="outline-success"
            type="button"
            onClick={() => setAuthType("login")}
          >
            Log In
          </Button>
        </Form>
      </div>
    </Container>
  );
};
