import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import Navigation from "./components/Navigation";
import AnimalList from "./components/AnimalList";
import ChatApp from "./components/ChatApp";
import ReportForm from "./components/ReportFile";
import ReportList from "./components/ReportList";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/navigation" element={<Navigation />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/animals" element={<AnimalList />} />
        <Route path="/chat" element={<ChatApp />} />
        <Route path="/report" element={<ReportForm />} />
        <Route path="/reportlist" element={<ReportList />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
