import React from 'react';
import './TaskCard.css';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const isOverdue = (dateString) => {
        if (!dateString) return false;
        return new Date(dateString) < new Date() && task.status !== 'Completed';
    };

    const hasReminder = () => {
        if (!task.reminderDate) return false;
        const reminderDate = new Date(task.reminderDate);
        const now = new Date();
        const daysDiff = Math.ceil((reminderDate - now) / (1000 * 60 * 60 * 24));
        return daysDiff <= 3 && daysDiff >= 0;
    };

    const getStatusOptions = () => {
        const statuses = ['Pending', 'In Progress', 'Completed'];
        return statuses.filter(s => s !== task.status);
    };

    return (
        <div className="task-card glass glass-hover">
            <div className="task-header">
                <div className="task-badges">
                    <span className={`badge badge-${task.priority.toLowerCase()}`}>
                        {task.priority}
                    </span>
                    <span className={`badge badge-${task.status.toLowerCase().replace(' ', '')}`}>
                        {task.status}
                    </span>
                </div>
                {hasReminder() && (
                    <div className="reminder-indicator" title="Reminder set">
                        🔔
                    </div>
                )}
            </div>

            <div className="task-content">
                <h3 className="task-title">{task.title}</h3>
                {task.description && (
                    <p className="task-description">{task.description}</p>
                )}
            </div>

            <div className="task-footer">
                <div className="task-dates">
                    {task.dueDate && (
                        <div className={`task-date ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
                            <span className="date-icon">📅</span>
                            <span>{formatDate(task.dueDate)}</span>
                            {isOverdue(task.dueDate) && <span className="overdue-badge">Overdue</span>}
                        </div>
                    )}
                </div>

                <div className="task-actions">
                    <div className="status-actions">
                        {getStatusOptions().map(status => (
                            <button
                                key={status}
                                className="action-btn"
                                onClick={() => onStatusChange(task._id, status)}
                                title={`Mark as ${status}`}
                            >
                                {status === 'Completed' && '✓'}
                                {status === 'In Progress' && '▶'}
                                {status === 'Pending' && '⏸'}
                            </button>
                        ))}
                    </div>
                    <button
                        className="action-btn edit-btn"
                        onClick={() => onEdit(task)}
                        title="Edit task"
                    >
                        ✏️
                    </button>
                    <button
                        className="action-btn delete-btn"
                        onClick={() => onDelete(task._id)}
                        title="Delete task"
                    >
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
