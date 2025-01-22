import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { LoginFormProps } from "../../../../shared/src/authTypes";
import "./AuthForm.css";
import { Button, Container, Form } from "react-bootstrap";
import { useToast } from "../../contexts/ToastContext";

export const LoginForm: React.FC<LoginFormProps> = ({ setAuthType }) => {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast();

  const handleSignIn = async () => {
    if (!email || !password) {
      showToast("Please fill in all fields.", "danger");
      return;
    }

    try {
      await signIn({ email, password });
    } catch (error) {
      showToast("Sign in failed. Please try again later.", "danger");
    }
  };

  return (
    <Container fluid className="login-container">
      <div className="login-box">
        <h1 className="title">SeekIt</h1>
        <p className="subtitle">Get a task and seek.</p>
        <Form>
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
          <Button className="login-btn" onClick={handleSignIn}>
            {loading ? "Logging In..." : "Log In"}
          </Button>
          <div className="divider"></div>
          <Button
            className="signup-btn"
            variant="outline-success"
            type="button"
            onClick={() => setAuthType("signup")}
          >
            Sign Up
          </Button>
        </Form>
      </div>
    </Container>
  );
};
