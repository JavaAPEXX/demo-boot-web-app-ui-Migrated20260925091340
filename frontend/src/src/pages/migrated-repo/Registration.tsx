import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * UNCONFIRMED: The exact shape of error responses from the `/registration` POST
 * endpoint is not defined in the supplied backend contract. This component
 * assumes the response may contain a JSON object with field‑error mappings,
 * e.g. `{ username: "error message", password: "error message", ... }`.
 * If the backend returns a different format, adjust the error handling logic
 * accordingly.
 */

const Registration: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [genericError, setGenericError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setGenericError("");

    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);
    params.append("passwordConfirm", passwordConfirm);

    try {
      const response = await fetch("/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
        credentials: "include", // preserve session cookies if any
      });

      if (response.ok) {
        // Successful registration – controller redirects to /welcome.
        // Since fetch follows redirects automatically, we simply navigate.
        navigate("/welcome");
      } else {
        // Attempt to parse field‑specific errors (UNCONFIRMED format)
        try {
          const data = await response.json();
          if (typeof data === "object" && data !== null) {
            setFieldErrors(data);
          } else {
            setGenericError("Registration failed. Please try again.");
          }
        } catch {
          // Fallback for non‑JSON error responses
          setGenericError("Registration failed. Please try again.");
        }
      }
    } catch (err) {
      setGenericError("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Main Navigation */}
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark default-color-dark fixed-top">
          <a className="navbar-brand" href="/">
            App Name
          </a>
        </nav>
      </header>

      <div className="container" style={{ marginTop: "80px" }}>
        <form className="form-signin" onSubmit={handleSubmit} noValidate>
          <h2 className="form-signin-heading">Create your account</h2>

          {/* Username */}
          <div className={`form-group ${fieldErrors.username ? "has-error" : ""}`}>
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              name="username"
            />
            {fieldErrors.username && (
              <div className="help-block">{fieldErrors.username}</div>
            )}
          </div>

          {/* Password */}
          <div className={`form-group ${fieldErrors.password ? "has-error" : ""}`}>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
            />
            {fieldErrors.password && (
              <div className="help-block">{fieldErrors.password}</div>
            )}
          </div>

          {/* Password Confirm */}
          <div
            className={`form-group ${
              fieldErrors.passwordConfirm ? "has-error" : ""
            }`}
          >
            <input
              type="password"
              className="form-control"
              placeholder="Confirm your password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              name="passwordConfirm"
            />
            {fieldErrors.passwordConfirm && (
              <div className="help-block">{fieldErrors.passwordConfirm}</div>
            )}
          </div>

          {/* Generic error message */}
          {genericError && (
            <div className="alert alert-danger" role="alert">
              {genericError}
            </div>
          )}

          <button
            className="btn btn-lg btn-primary btn-block"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting…" : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Registration;