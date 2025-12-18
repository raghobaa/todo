import React, { useState, useEffect } from 'react';
import './TaskModal.css';

const TaskModal = ({ task, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Pending',
        dueDate: '',
        reminderDate: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                priority: task.priority || 'Medium',
                status: task.status || 'Pending',
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
                reminderDate: task.reminderDate ? new Date(task.reminderDate).toISOString().split('T')[0] : ''
            });
        }
    }, [task]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.title.trim()) {
            setError('Task title is required');
            return;
        }

        setLoading(true);

        try {
            const taskData = {
                ...formData,
                dueDate: formData.dueDate || null,
                reminderDate: formData.reminderDate || null
            };
            await onSave(taskData);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="title">Task Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="input"
                            placeholder="Enter task title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            className="input textarea"
                            placeholder="Enter task description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="priority">Priority</label>
                            <select
                                id="priority"
                                name="priority"
                                className="input select"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                name="status"
                                className="input select"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="dueDate">Due Date</label>
                            <input
                                type="date"
                                id="dueDate"
                                name="dueDate"
                                className="input"
                                value={formData.dueDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="reminderDate">Reminder Date</label>
                            <input
                                type="date"
                                id="reminderDate"
                                name="reminderDate"
                                className="input"
                                value={formData.reminderDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <span className="loading"></span> : (task ? 'Update Task' : 'Create Task')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
