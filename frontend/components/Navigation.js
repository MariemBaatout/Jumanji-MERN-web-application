import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import pandaImg from "../assets/panda.png";
import aiImg from "../assets/ai.png";
import endangeredImg from "../assets/endangred.png";

const Navigation = () => {
  const navigate = useNavigate();
  const [sectionIndex, setSectionIndex] = useState(0);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      setSectionIndex((prev) => (prev + 1) % 3); // loop forward
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      setSectionIndex((prev) => (prev - 1 + 3) % 3); // loop backward
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const renderSection = () => {
    switch (sectionIndex) {
      case 0:
  return (
    <div style={{ ...styles.section, ...styles.heroSection }}>
      <div style={styles.heroCompact}>
        <h1 style={{ ...styles.heroTextSmall, ...styles.leftText }}>ANIMAL</h1>
        <img src={pandaImg} alt="Panda" style={styles.heroImageOverlap} />
        <h1 style={{ ...styles.heroTextSmall, ...styles.rightText }}>LIFE</h1>
      </div>
    </div>
  );
      case 1:
        return (
          <div style={styles.section}>
            <div style={styles.contentSection}>
              <div style={styles.textBlock}>
                <h3 style={{ color: "#EFEEEE" }}>Endangered Animal List</h3>
                <p style={{ color: "#EFEEEE" }}>
                  Here, you will find a list of endangered species along with the illegal activities that threaten them.
                  You will also discover the regions where these animals are found and the high-risk areas (heat zones)
                  where they are most vulnerable to threats such as poaching and habitat destruction.
                </p>
              </div>
              <img
                src={endangeredImg}
                alt="Endangered Animals"
                style={styles.contentImage}
                onClick={() => navigate("/animals")}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div style={styles.section}>
            <div style={styles.contentSection}>
              <img
                src={aiImg}
                alt="AI Analysis"
                style={styles.contentImage}
                onClick={() => navigate("/chat")}
              />
              <div style={styles.textBlock}>
                <h3 style={{ color: "#EFEEEE" }}>AI Image Analysis</h3>
                <p style={{ color: "#EFEEEE" }}>
                  In this section, you will be able to upload and share your animal photos with an advanced AI agent.
                  The AI will carefully analyze the image to determine whether the species in the photo is classified as endangered.
                  Additionally, it will assess the surroundings and context to detect any signs of illegal activities.
                  This feature helps raise awareness about endangered species while also contributing to wildlife protection efforts.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.logo}>JUMANJI</h3>
        <div style={styles.navButtons}>
          <button onClick={() => navigate("/animals")} style={styles.navBtn}>Endangered Animal</button>
          <button onClick={() => navigate("/chat")} style={styles.navBtn}>AI Image Analysis</button>
          <button onClick={() => navigate("/reportlist")} style={styles.navBtn}>Illegal Activity Reporting</button>
          <button onClick={() => navigate("/profile")} style={styles.navBtn}>My Profile</button>
        </div>
      </div>

      {/* Dynamic Section */}
      {renderSection()}

      {/* Navigation Dots */}
      <div style={styles.dotContainer}>
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            onClick={() => setSectionIndex(index)}
            style={{
              ...styles.dot,
              backgroundColor: sectionIndex === index ? "#0B653D" : "#D0D0D0",
              transform: sectionIndex === index ? "scale(1.2)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: "#7EB588",
    fontFamily: "Arial, sans-serif",
    height: "100vh", // Lock height
    overflow: "hidden", // Disable scroll
    position: "relative",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
  },
  logo: {
    color: "#0B653D",
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
  navButtons: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "10px",
    
  },
  navBtn: {
    backgroundColor: "#EFEEEE",
    border: "none",
    padding: "10px 20px",       // slightly increased padding
    borderRadius: "50px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",           // added to slightly enlarge the text
    color: "#0B653D",
  },
  section: {
    height: "calc(100vh - 100px)", // Ensure fits in viewport
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    textAlign: "center",
  },
  heroTitle: {
    fontSize: "2.5rem",
    margin: "20px 0",
  },
  heroImage: {
    width: "250px",
    height: "auto",
    borderRadius: "10px",
  },
  contentSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "30px",
    maxWidth: "1000px",
  },
  textBlock: {
    flex: "1",
    padding: "20px",
    maxWidth: "500px",
    fontSize:"20px",
    marginTop:"-70px",
  },
  contentImage: {
    flex: "1",
    width: "600px",
    height: "calc(100vh - 300px)",
    borderRadius: "10px",
    cursor: "pointer",
    marginTop:"-80px",
  },
  dotContainer: {
    position: "absolute",
    bottom: "40px", // A little higher
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  dot: {
    width: "16px",
    height: "16px",
    backgroundColor: "#D0D0D0",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  heroCompact: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "40px",
    transform: "scale(1.2)",
    marginTop: "-20px", // Fine-tune spacing from dots
  },
  
  heroTextSmall: {
    fontSize: "6rem",
    fontWeight: "bold",
    color: "#0B653D",
    margin: "0 20px",
    lineHeight: 1,
  },
  
  heroImageOverlap: {
    width: "350px",
    height: "auto",
    flexShrink: 0,
    position: "relative",
    top: "10px", // Less push down
  },

  heroSection: {
    backgroundColor: "#7EB588",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "calc(100vh - 300px)",
    paddingTop: "30px",
    transform: "translateX(-70px)",
  },
};

export default Navigation;
