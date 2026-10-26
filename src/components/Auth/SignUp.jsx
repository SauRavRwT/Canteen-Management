import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { motion } from "framer-motion";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./Auth.css";

const SignUp = () => {
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
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError("Failed to create an account: " + err.message);
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
              <h2>Create account</h2>
              <p>Get started with your free account</p>
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
                <label htmlFor="signup-email">Email</label>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="auth-input-group">
                <label htmlFor="signup-password">Password</label>
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                />
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </form>
          </div>

          <div className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Log In</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
