import { useState } from 'react';
import '../styles/Employees.css';

function EmployeesPage({ onNavigate, employees, onUpdateEmployee }) {
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    email: ''
  });

  const handleEdit = (employee) => {
    setEditingEmployee(employee.email);
    setFormData({
      name: employee.name,
      jobTitle: employee.jobTitle,
      email: employee.email
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateEmployee(editingEmployee, formData);
    setEditingEmployee(null);
  };

  const handleCancel = () => {
    setEditingEmployee(null);
  };

  return (
    <div className="employees-container">
      <div className="employees-header">
        <button className="btn-back" onClick={() => onNavigate('menu')}>Back</button>
        <h1>Manage Employees</h1>
      </div>
      <div className="employees-content">
        {employees.map((employee) => (
          <div key={employee.email} className="employee-card">
            {editingEmployee === employee.email ? (
              <form onSubmit={handleSubmit} className="employee-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Job Title</label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="disabled-input"
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-save">
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="employee-avatar">
                  {employee.profilePicture ? (
                    <img src={employee.profilePicture} alt="Profile" className="avatar-image" />
                  ) : (
                    <div className="avatar-placeholder">
                      {employee.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="employee-info">
                  <h3>{employee.name}</h3>
                  <p className="employee-title">{employee.jobTitle}</p>
                  <p className="employee-email">{employee.email}</p>
                </div>
                <button className="btn-edit-employee" onClick={() => handleEdit(employee)}>
                  Edit
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmployeesPage;
