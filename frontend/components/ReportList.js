import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import forestImage from "../assets/forest.jpg";
import { useNavigate } from "react-router-dom";

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchReports(); // Load all reports if search is empty
    } else {
      const delayDebounce = setTimeout(() => {
        searchReports(searchTerm); // Debounced search
      }, 500); // Wait 500ms after user stops typing

      return () => clearTimeout(delayDebounce); // Cleanup on new keystroke
    }
  }, [searchTerm]);

  const fetchReports = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/getUserReports", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  };

  const searchReports = async (key) => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/searchReport/${key}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to search reports:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/auth/deleteReport/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setReports(reports.filter((report) => report._id !== id));
    } catch (err) {
      console.error("Failed to delete report:", err);
    }
  };

  return (
    <div style={{ ...styles.container, backgroundImage: `url(${forestImage})` }}>
      {/* 🔝 Navbar */}
      <div style={styles.navbarContainer}>
        <div style={styles.navbar}>
          <input
            type="text"
            placeholder="Search by location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchBar}
          />
          <button onClick={() => navigate("/report")} style={styles.backButton}>
            Send A Report
          </button>
        </div>
      </div>

      {/* 📋 Report list below navbar */}
      <div style={styles.listWrapper}>
        {reports.map((report) => (
          <div key={report._id} style={styles.card}>
            <h3 style={styles.cardTitle}>{report.name}</h3>
            <p><strong>Description:</strong> {report.description}</p>
            <p><strong>Location:</strong> {report.Location}</p>
            <p><strong>Phone:</strong> {report.phone}</p>
            <button onClick={() => handleDelete(report._id)} style={styles.deleteBtn}>
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    padding: "40px 20px",
    boxSizing: "border-box",
  },
  navbarContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
  },
  navbar: {
    width: "100%",
    maxWidth: "800px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },
  searchBar: {
    flex: 1,
    padding: "10px 15px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  backButton: {
    padding: "10px 20px",
    borderRadius: "20px",
    backgroundColor: "#0B653D",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  listWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "800px",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "15px",
    padding: "20px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    position: "relative",
  },
  cardTitle: {
    marginBottom: "10px",
    color: "#0B653D",
  },
  deleteBtn: {
    position: "absolute",
    bottom: "15px",
    right: "15px",
    background: "#ff4d4d",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    padding: "8px",
    cursor: "pointer",
  },
};

export default ReportList;
