import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash } from 'react-icons/fi';
import bgImage from '../assets/bg.jpg'; 
import './Profile.css';


const Profile = () => {
  const [user, setUser] = useState(null);
  
  

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/getOneProfil', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUser(response.data[0]);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      alert(response.data.message || 'Logged out successfully');
      localStorage.removeItem('token');
      window.location.href = '/login'; // or use navigate('/login') if using React Router
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Logout failed. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete your profile?");
    if (!confirmDelete) return;
  
    try {
      const res = await fetch(`http://localhost:5000/api/auth/deleteSingleProfile/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (!res.ok) {
        throw new Error("Failed to delete profile");
      }
  
      alert("Profile deleted successfully.");
      localStorage.removeItem("token");
      setUser(null);
      window.location.href = "/login";
    } catch (err) {
      console.error("Error deleting profile:", err);
      alert("Failed to delete profile.");
    }
  };


  if (!user) return <p>Loading profile...</p>;

  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className="profile-container">
        <h2>User Profile</h2>
        <div className="profile-card">
        <p><strong>Id:</strong> {user.userId}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
          <div className="profile-actions">
          <button className="update-btn" onClick={handleLogout}>
  <FiEdit /> Logout
</button>
            <button className="delete-btn" onClick={() => handleDelete(user.userId)}><FiTrash /> Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
