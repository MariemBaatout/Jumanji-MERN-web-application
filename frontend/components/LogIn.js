import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }
      // Save token to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      // Navigate to protected route
      navigate("/navigation");
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong while logging in");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>LogIn</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleLogin} style={styles.button}>
        LogIn
      </button>
      <p style={styles.text}>
        Don't have an account?{" "}
        <span style={styles.link} onClick={() => navigate("/signup")}>
          Sign Up
        </span>
      </p>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#7EB588", 
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  input: {
    width: "80%",
    maxWidth: "300px",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "none",
    fontSize: "1rem",
  },
  button: {
    backgroundColor: "#0B653D",
    color: "#EFEEEE",
    border: "none",
    padding: "12px 24px",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
    marginBottom: "15px",
  },
  text: {
    fontSize: "0.9rem",
  },
  link: {
    color: "#a5d6a7",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default LogIn;
