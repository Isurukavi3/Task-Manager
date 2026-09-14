import TaskCard from '../components/TaskCard';
import '../styles/TaskPage.css';

function DonePage({ onNavigate, tasks, onDeleteTask, currentUser, onRefresh }) {
  return (
    <div className="task-page done">
      <div className="task-page-header">
        <button className="btn-back" onClick={() => onNavigate('menu')}>Back</button>
        <h1>Done Tasks</h1>
      </div>
      <div className="task-grid">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={onDeleteTask}
            currentUser={currentUser}
            onConflictResolved={onRefresh}
          />
        ))}
      </div>
    </div>
  );
}

export default DonePage;