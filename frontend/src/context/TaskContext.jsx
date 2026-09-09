import React, { createContext, useState, useCallback } from 'react';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getToken = () => localStorage.getItem('token');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tasks', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await response.json();
      if (data.success) {
        setTasks(data.tasks);
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = async (task) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(task),
      });
      const data = await response.json();
      if (data.success) {
        setTasks([data.task, ...tasks]);
        setError(null);
        return data;
      } else {
        setError(data.message);
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (data.success) {
        setTasks(tasks.map((task) => (task._id === id ? data.task : task)));
        setError(null);
        return data;
      } else {
        setError(data.message);
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await response.json();
      if (data.success) {
        setTasks(tasks.filter((task) => task._id !== id));
        setError(null);
        return data;
      } else {
        setError(data.message);
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
