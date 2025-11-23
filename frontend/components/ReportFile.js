import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import forestImage from "../assets/forest-bg.jpg"; 


const ReportFile = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    Location: "",
    phone: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/AddReport", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          Location: form.Location,
          phone: form.phone,
        }),
      });

      if (response.ok) {
        navigate("/reportlist");
      } else {
        console.log("Report submission failed.");
      }
    } catch (error) {
      setError("An error occurred while sending report.");
    }
  };

  return (
    <div style={{ ...styles.container, backgroundImage: `url(${forestImage})` }}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          Report illegal activity affecting endangered animals
        </h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          style={styles.input}
        />

        <textarea
          name="description"
          placeholder="Describe the incident"
          value={form.description}
          onChange={handleChange}
          style={{ ...styles.input, height: "80px" }}
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          style={styles.input}
        />

        <button onClick={handleSubmit} style={styles.button}>
          Send Report
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    padding: "50px 50px",
    width: "90%",
    maxWidth: "400px",
    backdropFilter: "blur(10px)",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#0B653D",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px 15px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    backgroundColor: "#0B653D",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
    width: "100%",
    marginTop: "10px",
  },
};

export default ReportFile;
