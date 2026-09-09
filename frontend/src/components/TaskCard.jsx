import React from 'react';
import '../styles/task-card.css';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const getStatusClass = (status) => {
    return `status-${status.toLowerCase().replace(' ', '-')}`;
  };

  const getPriorityClass = (priority) => {
    return `priority-${priority.toLowerCase()}`;
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h3>{task.title}</h3>
        <div className="task-badges">
          <span className={`status-badge ${getStatusClass(task.status)}`}>
            {task.status}
          </span>
          <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
            {task.priority}
          </span>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {task.dueDate && (
        <p className="task-due-date">
          📅 Due: {formatDate(task.dueDate)}
        </p>
      )}

      <div className="task-actions">
        <button onClick={() => onEdit(task)} className="btn-secondary btn-sm">
          Edit
        </button>
        <button onClick={() => onDelete(task._id)} className="btn-danger btn-sm">
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
