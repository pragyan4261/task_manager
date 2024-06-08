/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // Default to 'all' for no filter
    const [newTaskName, setNewTaskName] = useState(''); // State to store the new task name

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

    const handleCreateTask = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://task-manager-bphy.onrender.com/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                },
                body: JSON.stringify({
                    name: newTaskName,
                    status: 'pending', // Default to pending status for new tasks
                }),
            });

            const data = await response.json();
            if (data.status === 'ok') {
                setNewTaskName(''); // Clear the input field
                populateTasks(); // Refresh the task list
            } else {
                console.error('Failed to create task:', data.error);
            }
        } catch (error) {
            console.error('Error creating task:', error.message);
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

    return (
        <div id='_main'>
            <h1 id='heading'>Task Dashboard</h1>
            <div id='create_form'>
                <input
                    id='task_input'
                    type="text"
                    placeholder="New task name"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                />
                <button onClick={handleCreateTask} id='create_btn_form'>Create Task</button>
            </div>
            <div id='search_form_container'>
                <form onSubmit={handleSearchSubmit} id='search_form'>
                    <input
                    id='search_input'
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <select value={statusFilter} onChange={handleFilterChange} id='dropdown'>
                        <option value="all">All</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                    </select>
                    <button type="submit" id='search_btn_form'>Search</button>
                </form>
            </div>
            <ul id='card'>
                {tasks
                    .filter(task => statusFilter === 'all' || task.status === statusFilter)
                    .map((task) => (
                        <li key={task._id} id='list'>
                            <div>
                                {task.isEditing ? (
                                    <div className='card_input'>
                                        <input
                                        id='task_input'
                                            type="text"
                                            value={task.name}
                                            onChange={(e) => setTasks(tasks.map(t =>
                                                t._id === task._id ? { ...t, name: e.target.value } : t))}
                                        />
                                        <button onClick={() => handleUpdateTask(task._id, task.name, task.status)} id='save_btn_form'>Save</button>
                                        
                                    </div>
                                ) : (
                                    <div className='card_input'>
                                        <p className='task'>{task.name}</p>
                                        <div className='btn_container'>
                                        <button onClick={() => setTasks(tasks.map(t =>
                                            t._id === task._id ? { ...t, isEditing: true } : t))} id='edit_btn_form'>Edit</button>
                                        <button onClick={() => handleDeleteTask(task._id)} id='delete_btn_form'>Delete</button>

                                        </div>
                                    </div>
                                )}
                            </div>
                            <div id='checkbox_container'>
                                <label>
                                    <input
                                    className='checkbox'
                                        type="checkbox"
                                        checked={task.status === 'completed'}
                                        onChange={() => handleCheckboxChange(task._id, task.status)}
                                    />
                                    Completed
                                </label>
                                <label>
                                    <input
                                        className='checkbox'
                                        type="checkbox"
                                        checked={task.status === 'pending'}
                                        onChange={() => handleCheckboxChange(task._id, task.status)}
                                    />
                                    Pending
                                </label>
                                
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default Dashboard;
