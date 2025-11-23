import React from "react";
import { useNavigate } from "react-router-dom";
import lionImage from "../assets/lion.jpg"; 

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Jumanji</h1>
      <img src={lionImage} alt="Lion" style={styles.image} />
      <h2 style={styles.subtitle}>Where Endangered Animals Are Protected</h2>
      <button onClick={handleGetStarted} style={styles.button}>Get Started !</button>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#0B653D", 
    color: "#fff",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "20px"
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1rem"
  },
  image: {
    width: "300px",
    height: "auto",
    borderRadius: "6px",
    backgroundColor: "#fff",
    padding: "10px"
  },
  subtitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginTop: "1.5rem",
    marginBottom: "2rem"
  },
  button: {
    backgroundColor: "#7EB588", 
    color: "#EFEEEE",
    border: "none",
    padding: "12px 24px",
    borderRadius: "20px",
    fontSize: "36px",
    fontWeight: "800",
    cursor: "pointer",
  }
};

export default Home;
