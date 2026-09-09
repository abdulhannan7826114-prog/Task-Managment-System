import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { taskAPI } from '../utils/api';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await taskAPI.getTasks();
      setTasks(res.data.tasks);
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      await taskAPI.createTask(taskData);
      await fetchTasks();
      setShowForm(false);
      setError('');
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      await taskAPI.updateTask(id, taskData);
      await fetchTasks();
      setEditingTask(null);
      setError('');
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.deleteTask(id);
        await fetchTasks();
        setError('');
      } catch (err) {
        setError('Failed to delete task');
        console.error(err);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getFilteredTasks = () => {
    if (filter === 'All') return tasks;
    return tasks.filter(task => task.status === filter);
  };

  const filteredTasks = getFilteredTasks();

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'Todo').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    done: tasks.filter(t => t.status === 'Done').length
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>Task Management</h1>
            <p>Welcome, {user?.name}!</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary">Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="container">
          {error && <div className="error alert">{error}</div>}

          <div className="stats-grid">
            <div className="stat-card">
              <h3>{stats.total}</h3>
              <p>Total Tasks</p>
            </div>
            <div className="stat-card">
              <h3>{stats.todo}</h3>
              <p>To Do</p>
            </div>
            <div className="stat-card">
              <h3>{stats.inProgress}</h3>
              <p>In Progress</p>
            </div>
            <div className="stat-card">
              <h3>{stats.done}</h3>
              <p>Done</p>
            </div>
          </div>

          <div className="tasks-section">
            <div className="section-header">
              <h2>My Tasks</h2>
              <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                {showForm ? 'Cancel' : '+ Add Task'}
              </button>
            </div>

            {showForm && (
              <TaskForm
                onSubmit={editingTask ? (data) => handleUpdateTask(editingTask._id, data) : handleAddTask}
                initialTask={editingTask}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTask(null);
                }}
              />
            )}

            <div className="filter-buttons">
              {['All', 'Todo', 'In Progress', 'Done'].map(status => (
                <button
                  key={status}
                  className={`filter-btn ${filter === status ? 'active' : ''}`}
                  onClick={() => setFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>

            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <p>No tasks yet. {filter === 'All' ? 'Create one to get started!' : `No ${filter} tasks.`}</p>
              </div>
            ) : (
              <TaskList
                tasks={filteredTasks}
                onEdit={(task) => {
                  setEditingTask(task);
                  setShowForm(true);
                }}
                onDelete={handleDeleteTask}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
