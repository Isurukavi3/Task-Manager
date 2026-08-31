import { useState } from 'react';
import '../styles/Profile.css';

function ProfilePage({ onNavigate, userProfile, onUpdateProfile, onLogout }) {
  const [formData, setFormData] = useState({
    profilePicture: userProfile.profilePicture
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedData = { ...userProfile, profilePicture: reader.result };
        setFormData({ profilePicture: reader.result });
        onUpdateProfile(updatedData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    const updatedData = { ...userProfile, profilePicture: null };
    setFormData({ profilePicture: null });
    onUpdateProfile(updatedData);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button className="btn-back" onClick={() => onNavigate('menu')}>Back</button>
        <h1>Profile</h1>
      </div>
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            {userProfile.profilePicture ? (
              <img src={userProfile.profilePicture} alt="Profile" className="avatar-image" />
            ) : (
              <div className="avatar-placeholder">
                {userProfile.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="profile-info">
            <h2>{userProfile.name}</h2>
            <p className="job-title">{userProfile.jobTitle}</p>
            <p className="user-role">{userProfile.role === 'manager' ? 'Manager' : 'Employee'}</p>
          </div>
          <div className="profile-form">
            <div className="form-group">
              <label>Profile Picture</label>
              <div className="image-upload-section">
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
                <label htmlFor="profilePicture" className="btn-upload">
                  Choose Image
                </label>
                {userProfile.profilePicture && (
                  <button type="button" className="btn-remove-image" onClick={handleRemoveImage}>
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="profile-actions">
            <button className="btn-logout-profile" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
