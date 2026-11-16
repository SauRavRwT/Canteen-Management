import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { motion } from "framer-motion";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = location.state?.email || "";
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [splitEmail, setSplitEmail] = useState(initialEmail.split("@")[0] || "");
  const [message, setMessage] = useState(location.state?.message || "");

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
      setMessage("");
      setLoading(true);
      const auth = getAuth();
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      if (!user.emailVerified) {
        try {
          await sendEmailVerification(user);
          setMessage(
            `This email isn't verified yet. We sent a new verification link to ${email}.`,
          );
        } finally {
          await signOut(auth);
        }
        return;
      }
      navigate(location.state?.from?.pathname || "/");
    } catch (err) {
      setError("Failed to sign in: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <ThemeToggle className="theme-toggle-btn auth-theme-toggle" />
      {/* Form Panel */}
      <div className="auth-form-panel">
        <motion.div
          className="auth-form-wrapper"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="auth-card">
            <div className="auth-card-header">
              <h2>Welcome back</h2>
              <p>Sign in to your account to continue</p>
            </div>

            {email && (
              <div className="auth-avatar">
                <img
                  src={`https://ui-avatars.com/api/?name=${splitEmail}&background=E23744&color=fff&size=88`}
                  alt="profile"
                />
              </div>
            )}

            {message && (
              <div className="auth-message" role="status">
                {message}
              </div>
            )}
            {error && <div className="auth-error">{error}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-input-group">
                <label htmlFor="login-email">Email</label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  autoComplete="email"
                  placeholder="you@gmail.com"
                  required
                />
              </div>

              <div className="auth-input-group">
                <div className="auth-label-row">
                  <label htmlFor="login-password">Password</label>
                  <Link
                    to="/forgot-password"
                    state={{ email }}
                    className="auth-inline-link"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Log In"}
              </button>
            </form>
          </div>

          <div className="auth-switch">
            Need an account? <Link to="/signup">Sign Up</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
