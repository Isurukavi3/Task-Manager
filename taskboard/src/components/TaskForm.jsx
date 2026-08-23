import { useState } from 'react';
import '../styles/TaskForm.css';

function TaskForm({ onAddTask, onCancel, employees }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assigneeEmail: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.assigneeEmail) {
      const selectedEmployee = employees.find(emp => emp.email === formData.assigneeEmail);
      onAddTask({
        ...formData,
        assignee: selectedEmployee.name
      });
      setFormData({ title: '', description: '', priority: 'medium', assigneeEmail: '' });
    }
  };

  return (
    <div className="task-form-overlay">
      <div className="task-form-container">
        <h2>Add New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows="4"
            />
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="form-group">
            <label>Assign To Employee</label>
            <select 
              name="assigneeEmail" 
              value={formData.assigneeEmail} 
              onChange={handleChange}
              required
            >
              <option value="">Select an employee</option>
              {employees.map((employee) => (
                <option key={employee.email} value={employee.email}>
                  {employee.name} - {employee.jobTitle}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn-submit">Add Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
