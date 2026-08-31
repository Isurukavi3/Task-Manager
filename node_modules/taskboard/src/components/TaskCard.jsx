import '../styles/TaskCard.css';

function TaskCard({ task, onDelete, onMove, moveLabel, currentUser, showMove = false }) {
  return (
    <div className="task-card">
      <div className="task-header">
        <h3>{task.title}</h3>
        <button className="btn-delete" onClick={() => onDelete(task.id)}>×</button>
      </div>
      <p className="task-description">{task.description}</p>
      <div className="task-assignee">
        <span className="assignee-label">Assigned to: </span>
        <span className="assignee-name">{task.assignee}</span>
      </div>
      <div className="task-footer">
        <span className="task-priority" data-priority={task.priority}>
          {task.priority}
        </span>
        <span className="task-date">{task.date}</span>
      </div>
      {onMove && showMove && (
        <button className="btn-move" onClick={() => onMove(task.id)}>
          {moveLabel}
        </button>
      )}
      {onMove && !showMove && task.assigneeEmail !== currentUser?.email && (
        <p className="move-disabled-message">Only assigned employee can move this task</p>
      )}
    </div>
  );
}

export default TaskCard;
