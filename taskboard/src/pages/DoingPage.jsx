import TaskCard from '../components/TaskCard';
import '../styles/TaskPage.css';

function DoingPage({ onNavigate, tasks, onDeleteTask, onMoveTask, currentUser }) {
  return (
    <div className="task-page doing">
      <div className="task-page-header">
        <button className="btn-back" onClick={() => onNavigate('menu')}>Back</button>
        <h1>Doing Tasks</h1>
      </div>
      <div className="task-grid">
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onDelete={onDeleteTask}
            onMove={onMoveTask}
            moveLabel="Move to Done"
            currentUser={currentUser}
            showMove={task.assigneeEmail === currentUser?.email}
          />
        ))}
      </div>
    </div>
  );
}

export default DoingPage;
