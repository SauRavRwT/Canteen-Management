import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Card, Form, Button, Alert, Container } from "react-bootstrap";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [splitEmail, setSplitEmail] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setSplitEmail(e.target.value.split("@")[0] || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }
    try {
      setError("");
      setLoading(true);
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError("Failed to sign in: " + err.message);
    }
    setLoading(false);
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <motion.div 
        className="w-100" 
        style={{ maxWidth: "400px" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="rounded-4 shadow-sm border-0">
          <Card.Body>
            <h2 className="mb-4 fw-bold p-2">Login</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              {email && (
                <div className="d-flex justify-content-center mb-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${splitEmail}&background=random`}
                    alt="profile"
                    className="rounded-circle"
                    width="100"
                    height="100"
                  />
                </div>
              )}
              <Form.Group id="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                </div>
              </Form.Group>
              <Form.Group id="password" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Button
                disabled={loading}
                className="w-100 rounded-4"
                type="submit"
              >
                Log In
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          Need an account?{" "}
          <Link to="/signup" className="text-decoration-none">
            Sign Up
          </Link>
        </div>
      </motion.div>
    </Container>
  );
};

export default Login;
