import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { motion } from "framer-motion";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./Auth.css";

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

            {error && <div className="auth-error">{error}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-input-group">
                <label htmlFor="login-email">Email</label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="auth-input-group">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            Need an account?{" "}
            <Link to="/signup">Sign Up</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
