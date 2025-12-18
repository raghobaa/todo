import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import './Dashboard.css';

const API_URL = 'http://localhost:5000/api';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [filters, setFilters] = useState({
        status: 'All',
        priority: 'All',
        sortBy: 'createdAt'
    });

    useEffect(() => {
        fetchTasks();
    }, [filters]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters.status !== 'All') params.append('status', filters.status);
            if (filters.priority !== 'All') params.append('priority', filters.priority);
            params.append('sortBy', filters.sortBy);

            const response = await axios.get(`${API_URL}/tasks?${params.toString()}`);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = () => {
        setEditingTask(null);
        setShowModal(true);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowModal(true);
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            await axios.delete(`${API_URL}/tasks/${taskId}`);
            setTasks(tasks.filter(task => task._id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task');
        }
    };

    const handleSaveTask = async (taskData) => {
        try {
            if (editingTask) {
                const response = await axios.put(`${API_URL}/tasks/${editingTask._id}`, taskData);
                setTasks(tasks.map(task => task._id === editingTask._id ? response.data : task));
            } else {
                const response = await axios.post(`${API_URL}/tasks`, taskData);
                setTasks([response.data, ...tasks]);
            }
            setShowModal(false);
            setEditingTask(null);
        } catch (error) {
            console.error('Error saving task:', error);
            throw error;
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const response = await axios.put(`${API_URL}/tasks/${taskId}`, { status: newStatus });
            setTasks(tasks.map(task => task._id === taskId ? response.data : task));
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    const getTaskStats = () => {
        return {
            total: tasks.length,
            pending: tasks.filter(t => t.status === 'Pending').length,
            inProgress: tasks.filter(t => t.status === 'In Progress').length,
            completed: tasks.filter(t => t.status === 'Completed').length
        };
    };

    const stats = getTaskStats();

    return (
        <div className="dashboard">
            <header className="dashboard-header glass">
                <div className="header-content">
                    <div className="header-left">
                        <h1>ToDo Manager</h1>
                        <p>Welcome back, <strong>{user?.name}</strong></p>
                    </div>
                    <button onClick={logout} className="btn btn-secondary">
                        Logout
                    </button>
                </div>
            </header>

            <div className="dashboard-container">
                <div className="stats-grid">
                    <div className="stat-card glass">
                        <div className="stat-icon" style={{ background: 'var(--gradient-primary)' }}>📊</div>
                        <div className="stat-info">
                            <h3>{stats.total}</h3>
                            <p>Total Tasks</p>
                        </div>
                    </div>
                    <div className="stat-card glass">
                        <div className="stat-icon" style={{ background: 'var(--gradient-warning)' }}>⏳</div>
                        <div className="stat-info">
                            <h3>{stats.pending}</h3>
                            <p>Pending</p>
                        </div>
                    </div>
                    <div className="stat-card glass">
                        <div className="stat-icon" style={{ background: 'var(--gradient-primary)' }}>🚀</div>
                        <div className="stat-info">
                            <h3>{stats.inProgress}</h3>
                            <p>In Progress</p>
                        </div>
                    </div>
                    <div className="stat-card glass">
                        <div className="stat-icon" style={{ background: 'var(--gradient-success)' }}>✅</div>
                        <div className="stat-info">
                            <h3>{stats.completed}</h3>
                            <p>Completed</p>
                        </div>
                    </div>
                </div>

                <div className="controls-section glass">
                    <div className="filters">
                        <div className="filter-group">
                            <label>Status</label>
                            <select
                                className="input select"
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            >
                                <option value="All">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Priority</label>
                            <select
                                className="input select"
                                value={filters.priority}
                                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                            >
                                <option value="All">All Priorities</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Sort By</label>
                            <select
                                className="input select"
                                value={filters.sortBy}
                                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                            >
                                <option value="createdAt">Created Date</option>
                                <option value="dueDate">Due Date</option>
                                <option value="priority">Priority</option>
                            </select>
                        </div>
                    </div>

                    <button onClick={handleCreateTask} className="btn btn-primary">
                        + New Task
                    </button>
                </div>

                <div className="tasks-section">
                    {loading ? (
                        <div className="loading-container">
                            <div className="loading" style={{ width: '40px', height: '40px' }}></div>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="empty-state glass">
                            <div className="empty-icon">📝</div>
                            <h3>No tasks found</h3>
                            <p>Create your first task to get started!</p>
                            <button onClick={handleCreateTask} className="btn btn-primary">
                                Create Task
                            </button>
                        </div>
                    ) : (
                        <div className="tasks-grid">
                            {tasks.map(task => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    onEdit={handleEditTask}
                                    onDelete={handleDeleteTask}
                                    onStatusChange={handleStatusChange}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <TaskModal
                    task={editingTask}
                    onSave={handleSaveTask}
                    onClose={() => {
                        setShowModal(false);
                        setEditingTask(null);
                    }}
                />
            )}
        </div>
    );
};

export default Dashboard;
