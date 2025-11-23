import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "public",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    // Validate that all fields are filled
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }
    // Validate that passwords match
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      // Send a POST request to the backend to register the user
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });
      if (!response.ok) {
        const text = await response.text();
        console.error("Signup failed:", response.status, text);
        setError("Signup failed: " + text);
        return;
      }
      // Navigate to login page after successful signup
      navigate("/login");
    } catch (error) {
      setError("An error occurred while signing up.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Sign Up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        style={styles.input}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        style={styles.input}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        style={styles.input}
      />

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={form.confirmPassword}
        onChange={handleChange}
        style={styles.input}
      />

      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        style={styles.select}
      >
        <option value="admin">Admin</option>
        <option value="public">Public</option>
        <option value="reasercher">Reasercher</option>
        <option value="ranger">Ranger</option>
      </select>

      <button onClick={handleSignup} style={styles.button}>
        Sign Up
      </button>

      <p style={styles.text}>
        Already have an account?{" "}
        <span style={styles.link} onClick={() => navigate("/login")}>
          LogIn
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
  select: {
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

export default Signup;
