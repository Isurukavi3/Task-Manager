import { useState } from 'react';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import '../styles/TaskPage.css';

function TodoPage({ onNavigate, tasks, onAddTask, onDeleteTask, onMoveTask, currentUser, employees }) {
  const [showForm, setShowForm] = useState(false);
  const isManager = currentUser?.role === 'manager';

  const handleAddTask = (taskData) => {
    onAddTask(taskData);
    setShowForm(false);
  };

  return (
    <div className="task-page">
      <div className="task-page-header">
        <button className="btn-back" onClick={() => onNavigate('menu')}>Back</button>
        <h1>To Do Tasks</h1>
        {isManager && <button className="btn-add" onClick={() => setShowForm(true)}>+ Add Task</button>}
      </div>
      <div className="task-grid">
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onDelete={onDeleteTask}
            onMove={onMoveTask}
            moveLabel="Move to Doing"
            currentUser={currentUser}
            showMove={task.assigneeEmail === currentUser?.email}
          />
        ))}
      </div>
      {showForm && <TaskForm onAddTask={handleAddTask} onCancel={() => setShowForm(false)} employees={employees} />}
    </div>
  );
}

export default TodoPage;
