import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { motion } from "framer-motion";
import { FaEnvelopeOpenText } from "react-icons/fa";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./Auth.css";

const RESEND_COOLDOWN_SECONDS = 30;

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase());

// After resetting on Firebase's hosted page, "Continue" brings the user back here.
const continueUrl = () => `${window.location.origin}${import.meta.env.BASE_URL}login`;

const sendResetLink = async (auth, email) => {
  try {
    await sendPasswordResetEmail(auth, email, { url: continueUrl() });
  } catch (error) {
    // The current domain isn't in Firebase's authorized domains list: still send
    // the email, just without the "Continue" button back to the app.
    if (
      error.code === "auth/unauthorized-continue-uri" ||
      error.code === "auth/invalid-continue-uri"
    ) {
      await sendPasswordResetEmail(auth, email);
      return;
    }
    throw error;
  }
};

const friendlyError = (error) => {
  switch (error?.code) {
    case "auth/invalid-email":
    case "auth/missing-email":
      return "Enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many reset requests. Please wait a few minutes and try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return "We couldn't send the reset email. Please try again.";
  }
};

const ForgotPassword = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [sentTo, setSentTo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = window.setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const requestReset = async (targetEmail) => {
    const normalizedEmail = targetEmail.trim();
    if (!isValidEmail(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await sendResetLink(getAuth(), normalizedEmail);
      setSentTo(normalizedEmail);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      // Don't reveal whether an account exists for this address.
      if (err.code === "auth/user-not-found") {
        setSentTo(normalizedEmail);
        setCooldown(RESEND_COOLDOWN_SECONDS);
      } else {
        setError(friendlyError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    requestReset(email);
  };

  return (
    <div className="auth-page">
      <ThemeToggle className="theme-toggle-btn auth-theme-toggle" />
      <div className="auth-form-panel">
        <motion.div
          className="auth-form-wrapper"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="auth-card">
            {sentTo ? (
              <div className="auth-sent" role="status" aria-live="polite">
                <div className="auth-sent-icon" aria-hidden="true">
                  <FaEnvelopeOpenText />
                </div>
                <div className="auth-card-header">
                  <h2>Check your email</h2>
                  <p>
                    If an account exists for <strong>{sentTo}</strong>, we've sent a link to
                    reset your password.
                  </p>
                </div>
                <p className="auth-hint">
                  The link expires in about an hour. Can't find it? Check your spam or
                  promotions folder.
                </p>

                {error && <div className="auth-error">{error}</div>}

                <div className="auth-actions">
                  <Link
                    to="/login"
                    state={{ email: sentTo }}
                    className="auth-submit-btn auth-link-btn"
                  >
                    Back to log in
                  </Link>
                  <button
                    type="button"
                    className="auth-secondary-btn"
                    onClick={() => requestReset(sentTo)}
                    disabled={loading || cooldown > 0}
                  >
                    {loading
                      ? "Sending..."
                      : cooldown > 0
                        ? `Resend email in ${cooldown}s`
                        : "Resend email"}
                  </button>
                  <button
                    type="button"
                    className="auth-text-btn"
                    onClick={() => {
                      setSentTo("");
                      setError("");
                    }}
                  >
                    Use a different email
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="auth-card-header">
                  <h2>Forgot password?</h2>
                  <p>Enter your account email and we'll send you a link to reset it.</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                  <div className="auth-input-group">
                    <label htmlFor="reset-email">Email</label>
                    <input
                      id="reset-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@gmail.com"
                      autoFocus
                      required
                    />
                  </div>

                  <button type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading ? "Sending link..." : "Send reset link"}
                  </button>
                </form>
              </>
            )}
          </div>

          <div className="auth-switch">
            Remembered it? <Link to="/login" state={{ email: sentTo || email }}>Log In</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
