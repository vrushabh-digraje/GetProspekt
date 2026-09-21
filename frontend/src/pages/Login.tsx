import React, { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import gettLogo from "../assets/images/gett.png";
import { authApi } from "../services/api";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [focused, setFocused] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname || "/dashboard";

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authApi.login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      {/* Full-screen background image */}
      <div className="login-background" />
      <div className="login-background-overlay" />

      {/* Animated ambient elements */}
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <div className="login-layout">
        <section className="login-intro">
          <div className="intro-top">
            <Link to="/" aria-label="GETprospeKt Home">
              <img src={gettLogo} alt="GETprospeKt" className="intro-logo" />
            </Link>
            <span className="secure-badge">
              <i /> Secure Workspace
            </span>
          </div>

          <div className="intro-main">
            <span className="intro-kicker">PUBLICATION MANAGEMENT</span>
            <h1>
              Better Pipeline.
              <br />
              <em>Better Decisions.</em>
            </h1>
            <p>
              A focused workspace for managing your articles, case studies,
              resources and publication content.
            </p>

            <div className="intro-stats">
              <div className="stat-item">
                <strong>01</strong>
                <span>Content</span>
              </div>
              <div className="stat-line" />
              <div className="stat-item">
                <strong>02</strong>
                <span>Insights</span>
              </div>
              <div className="stat-line" />
              <div className="stat-item">
                <strong>03</strong>
                <span>Growth</span>
              </div>
            </div>
          </div>

          <div className="intro-bottom">
            <span>GETprospeKt</span>
            <span>Management Workspace</span>
          </div>
        </section>

        <section className="login-side">
          <div className="login-card">
            <div className="card-glow" />

            <div className="card-header">
              <div className="mobile-brand">
                <img src={gettLogo} alt="GETprospeKt" />
              </div>
              <span className="welcome-label">WELCOME BACK</span>
              <h2>Sign in</h2>
              <p>Access your publication management workspace.</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              <div
                className={`field ${focused === "email" ? "is-focused" : ""} ${
                  email ? "has-value" : ""
                }`}
              >
                <label htmlFor="email">Email address</label>
                <div className="field-input">
                  <span className="field-icon">✉</span>
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@getprospekt.co"
                    value={email}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused("")}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div
                className={`field ${focused === "password" ? "is-focused" : ""} ${
                  password ? "has-value" : ""
                }`}
              >
                <div className="label-row">
                  <label htmlFor="password">Password</label>
                  <button
                    type="button"
                    className="forgot-btn"
                    onClick={() =>
                      setError("Password reset is not available in this static POC.")
                    }
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="field-input">
                  <span className="field-icon">●</span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused("")}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="show-btn"
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <label className="remember-row">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className="custom-check">✓</span>
                <span>Remember me</span>
              </label>

              {error && (
                <div className="error-message">
                  <span>!</span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className={`login-button ${loading ? "is-loading" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to dashboard
                    <span className="button-arrow">→</span>
                  </>
                )}
              </button>
            </form>
            <div className="card-footer">
              <button type="button" onClick={() => navigate("/")}>
                <span>←</span> Back to website
              </button>
              <span>Static POC</span>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .login-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          color: #fff;
          font-family: var(--font-sans);
          background: #07090f;
        }

        .login-background,
        .login-background-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
        }

        .login-background {
          background-image: url("https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2200&q=90");
          background-size: cover;
          background-position: center;
          transform: scale(1.04);
          animation: backgroundDrift 18s ease-in-out infinite alternate;
        }

        .login-background-overlay {
          background:
            linear-gradient(90deg, rgba(3,5,10,.96) 0%, rgba(3,5,10,.84) 42%, rgba(12,18,34,.64) 72%, rgba(25,34,57,.48) 100%),
            linear-gradient(180deg, rgba(0,0,0,.30), rgba(0,0,0,.72));
        }

        @keyframes backgroundDrift {
          from { transform: scale(1.04); }
          to { transform: scale(1.09); }
        }

        .ambient {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(1px);
          opacity: .55;
        }

        .ambient-one {
          width: 280px;
          height: 280px;
          top: -100px;
          right: 14%;
          background: rgba(150,174,252,.16);
          animation: floatOne 9s ease-in-out infinite;
        }

        .ambient-two {
          width: 180px;
          height: 180px;
          bottom: 4%;
          left: 38%;
          background: rgba(100,125,220,.12);
          animation: floatTwo 12s ease-in-out infinite;
        }

        .ambient-three {
          width: 90px;
          height: 90px;
          top: 26%;
          right: 5%;
          border: 1px solid rgba(255,255,255,.12);
          animation: pulse 4s ease-in-out infinite;
        }

        @keyframes floatOne {
          0%, 100% { transform: translate(0,0); }
          50% { transform: translate(-30px,25px); }
        }

        @keyframes floatTwo {
          0%, 100% { transform: translate(0,0); }
          50% { transform: translate(28px,-22px); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: .25; }
          50% { transform: scale(1.18); opacity: .65; }
        }

        .login-layout {
          min-height: 100vh;
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1.15fr .85fr;
          padding: 30px 5vw;
          gap: 5vw;
        }

        .login-intro {
          min-height: calc(100vh - 60px);
          display: flex;
          flex-direction: column;
          padding: 28px 3vw;
        }

        .intro-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .intro-logo {
          width: 215px;
          max-width: 65%;
          height: auto;
          object-fit: contain;
        }

        .secure-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 999px;
          background: rgba(255,255,255,.06);
          backdrop-filter: blur(10px);
          color: rgba(255,255,255,.68);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .8px;
          text-transform: uppercase;
        }

        .secure-badge i {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          display: inline-block;
          background: #72d68b;
          box-shadow: 0 0 12px rgba(114,214,139,.75);
        }

        .intro-main {
          max-width: 720px;
          margin: auto 0;
          padding: 70px 0;
          animation: introReveal .8s ease-out both;
        }

        @keyframes introReveal {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .intro-kicker {
          color: #b9c8ff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2.8px;
        }

        .intro-main h1 {
          margin: 18px 0 24px;
          font-size: clamp(52px, 5.6vw, 84px);
          line-height: 1.01;
          letter-spacing: -3.5px;
          font-weight: 800;
        }

        .intro-main h1 em {
          color: #b9c8ff;
          font-style: normal;
        }

        .intro-main p {
          max-width: 570px;
          margin: 0;
          color: rgba(255,255,255,.66);
          font-size: 17px;
          line-height: 1.75;
        }

        .intro-stats {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-top: 48px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .stat-item strong {
          color: #b9c8ff;
          font-size: 12px;
        }

        .stat-item span {
          color: rgba(255,255,255,.55);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .stat-line {
          width: 1px;
          height: 22px;
          background: rgba(255,255,255,.18);
        }

        .intro-bottom {
          display: flex;
          justify-content: space-between;
          color: rgba(255,255,255,.35);
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .login-side {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px 0;
        }

        .login-card {
          position: relative;
          width: min(100%, 475px);
          padding: 40px;
          border: 1px solid rgba(255,255,255,.16);
          border-radius: 24px;
          background: rgba(10,13,22,.76);
          box-shadow: 0 30px 80px rgba(0,0,0,.42);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          animation: cardReveal .8s .1s ease-out both;
        }

        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(25px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .card-glow {
          position: absolute;
          width: 150px;
          height: 150px;
          top: -90px;
          right: -60px;
          border-radius: 50%;
          background: rgba(150,174,252,.16);
          filter: blur(35px);
          pointer-events: none;
        }

        .mobile-brand {
          display: none;
        }

        .card-header {
          position: relative;
          margin-bottom: 31px;
        }

        .welcome-label {
          color: #aebeff;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2.2px;
        }

        .card-header h2 {
          margin: 11px 0 8px;
          font-size: 38px;
          line-height: 1;
          letter-spacing: -1.5px;
        }

        .card-header p {
          margin: 0;
          color: rgba(255,255,255,.52);
          font-size: 13px;
          line-height: 1.6;
        }

        .field {
          margin-bottom: 19px;
        }

        .field label,
        .label-row label {
          display: block;
          margin-bottom: 8px;
          color: rgba(255,255,255,.82);
          font-size: 12px;
          font-weight: 700;
        }

        .label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .forgot-btn,
        .show-btn {
          border: 0;
          background: transparent;
          color: #aebeff;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .field-input {
          position: relative;
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 11px;
          background: rgba(255,255,255,.055);
          transition: .22s ease;
        }

        .field.is-focused .field-input {
          border-color: #96aefc;
          background: rgba(150,174,252,.08);
          box-shadow: 0 0 0 4px rgba(150,174,252,.08);
        }

        .field-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #8290b4;
          font-size: 12px;
          pointer-events: none;
        }

        .field-input input {
          width: 100%;
          min-height: 49px;
          border: 0;
          outline: 0;
          background: transparent;
          color: #fff;
          padding: 13px 70px 13px 43px;
          font-size: 13px;
        }

        .field-input input::placeholder {
          color: rgba(255,255,255,.30);
        }

        .show-btn {
          position: absolute;
          right: 13px;
          top: 50%;
          transform: translateY(-50%);
        }

        .remember-row {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: rgba(255,255,255,.55);
          font-size: 11px;
          cursor: pointer;
          margin: 1px 0 17px;
        }

        .remember-row input {
          position: absolute;
          opacity: 0;
        }

        .custom-check {
          width: 16px;
          height: 16px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.22);
          border-radius: 4px;
          color: transparent;
          font-size: 10px;
          transition: .2s ease;
        }

        .remember-row input:checked + .custom-check {
          background: #96aefc;
          border-color: #96aefc;
          color: #111522;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 15px;
          padding: 11px 12px;
          border: 1px solid rgba(255,110,110,.25);
          border-radius: 9px;
          background: rgba(255,70,70,.08);
          color: #ffb1b1;
          font-size: 11px;
          line-height: 1.4;
        }

        .error-message span {
          width: 17px;
          height: 17px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: rgba(255,100,100,.2);
          flex: 0 0 auto;
        }

        .login-button {
          position: relative;
          overflow: hidden;
          width: 100%;
          min-height: 51px;
          border: 0;
          border-radius: 11px;
          background: #7287C9;
          color: white;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 12px 30px rgba(0,0,0,.25);
          transition: .25s ease;
        }

        .login-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 70%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent);
          transform: skewX(-18deg);
          transition: left .6s ease;
        }

        .login-button:hover::before {
          left: 140%;
        }

        .login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 17px 35px rgba(0,0,0,.34);
        }

        .login-button:disabled {
          cursor: wait;
          opacity: .82;
          transform: none;
        }

        .button-arrow {
          margin-left: 10px;
          font-size: 17px;
          vertical-align: -1px;
        }

        .spinner {
          display: inline-block;
          width: 15px;
          height: 15px;
          margin-right: 9px;
          border: 2px solid rgba(255,255,255,.35);
          border-top-color: white;
          border-radius: 50%;
          vertical-align: -3px;
          animation: spin .7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 21px;
          color: rgba(255,255,255,.28);
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: .8px;
        }

        .card-footer button {
          border: 0;
          background: transparent;
          color: rgba(255,255,255,.58);
          padding: 0;
          cursor: pointer;
          font-size: 10px;
          font-weight: 700;
        }

        .card-footer button span {
          margin-right: 4px;
        }

        @media (max-width: 1050px) {
          .login-layout {
            grid-template-columns: 1fr;
            padding: 25px;
          }

          .login-intro {
            min-height: auto;
            padding: 20px 15px 0;
          }

          .intro-main {
            margin: 55px 0 35px;
            padding: 0;
          }

          .intro-main h1 {
            font-size: clamp(42px, 8vw, 65px);
          }

          .intro-main p {
            font-size: 15px;
          }

          .intro-bottom {
            display: none;
          }

          .login-side {
            padding: 10px 15px 45px;
          }

          .login-card {
            width: min(100%, 510px);
          }
        }

        @media (max-width: 600px) {
          .login-layout {
            padding: 14px;
          }

          .login-intro {
            padding: 14px 8px 0;
          }

          .intro-logo {
            width: 165px;
          }

          .secure-badge {
            padding: 7px 9px;
            font-size: 8px;
          }

          .intro-main {
            margin: 40px 0 28px;
          }

          .intro-kicker {
            font-size: 9px;
            letter-spacing: 2px;
          }

          .intro-main h1 {
            margin: 13px 0 15px;
            font-size: 38px;
            letter-spacing: -1.8px;
          }

          .intro-main p {
            font-size: 13px;
            line-height: 1.55;
          }

          .intro-stats {
            gap: 13px;
            margin-top: 25px;
          }

          .stat-item {
            gap: 6px;
          }

          .stat-item span {
            font-size: 8px;
          }

          .stat-line {
            height: 17px;
          }

          .login-side {
            padding: 0 0 28px;
          }

          .login-card {
            padding: 28px 21px;
            border-radius: 19px;
          }

          .mobile-brand {
            display: block;
            margin-bottom: 24px;
          }

          .mobile-brand img {
            width: 150px;
            max-width: 70%;
          }

          .card-header h2 {
            font-size: 32px;
          }

          .card-header p {
            font-size: 12px;
          }

          .credential {
            align-items: flex-start;
            flex-direction: column;
            gap: 4px;
          }

          .credential strong {
            word-break: break-word;
          }
        }

        @media (max-width: 380px) {
          .intro-main h1 {
            font-size: 33px;
          }

          .intro-stats {
            display: none;
          }

          .login-card {
            padding: 24px 17px;
          }

          .label-row {
            align-items: flex-start;
            flex-direction: column;
            gap: 3px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .login-background,
          .ambient,
          .intro-main,
          .login-card {
            animation: none !important;
          }

          .login-button {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
};

export default Login;
