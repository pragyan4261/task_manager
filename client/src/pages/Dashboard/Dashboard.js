/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // Default to 'all' for no filter

    useEffect(() => {
        populateTasks();
    }, []); // Only run once on mount

    const populateTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const user = jwtDecode(token);
            if (!user) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            const url = `https://task-manager-bphy.onrender.com/api/tasks?search=${searchTerm}&status=${statusFilter}`;
            const response = await fetch(url, {
                headers: {
                    'x-access-token': token,
                },
            });

            const data = await response.json();
            if (data.status === 'ok') {
                setTasks(data.tasks);
            } else {
                console.error('Failed to fetch tasks:', data.error);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error.message);
        }
    };

    const handleUpdateTask = async (taskId, newName, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://task-manager-bphy.onrender.com/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                },
                body: JSON.stringify({
                    name: newName,
                    status: newStatus,
                }),
            });

            const data = await response.json();
            if (data.status === 'ok') {
                populateTasks();
            } else {
                console.error('Failed to update task:', data.error);
            }
        } catch (error) {
            console.error('Error updating task:', error.message);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://task-manager-bphy.onrender.com/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'x-access-token': token,
                },
            });

            const data = await response.json();
            if (data.status === 'ok') {
                populateTasks();
            } else {
                console.error('Failed to delete task:', data.error);
            }
        } catch (error) {
            console.error('Error deleting task:', error.message);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        populateTasks();
    };

    const handleCheckboxChange = async (taskId, currentStatus) => {
        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
        await handleUpdateTask(taskId, tasks.find(task => task._id === taskId).name, newStatus);
    };

    // const handleUpdateButtonClick = async (taskId, newName) => {
    //     await handleUpdateTask(taskId, newName);
    // };

    return (
        <div>
            <h1>Task Dashboard</h1>
            <div>
                <form onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <select value={statusFilter} onChange={handleFilterChange}>
                        <option value="all">All</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                    </select>
                    <button type="submit">Search</button>
                </form>
            </div>
            <ul>
                {tasks
                    .filter(task => statusFilter === 'all' || task.status === statusFilter)
                    .map((task) => (
                        <li key={task._id}>
                            <div>
                                {task.isEditing ? (
                                    <div>
                                        <input
                                            type="text"
                                            value={task.name}
                                            onChange={(e) => setTasks(tasks.map(t =>
                                                t._id === task._id ? { ...t, name: e.target.value } : t))}
                                        />
                                        <button onClick={() => handleUpdateTask(task._id, task.name)}>Save</button>
                                    </div>
                                ) : (
                                    <div>
                                        <p>{task.name}</p>
                                        <button onClick={() => setTasks(tasks.map(t =>
                                            t._id === task._id ? { ...t, isEditing: true } : t))}>Edit</button>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={task.status === 'completed'}
                                        onChange={() => handleCheckboxChange(task._id, task.status)}
                                    />
                                    Completed
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={task.status === 'pending'}
                                        onChange={() => handleCheckboxChange(task._id, task.status)}
                                    />
                                    Pending
                                </label>
                                <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default Dashboard;


