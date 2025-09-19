const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user.model');
const Task = require('./models/task.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Health check endpoint for self-ping
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running', timestamp: new Date().toISOString() });
});

mongoose.connect(process.env.MONGO_URI);
mongoose.set('strictQuery', true);

// Self-ping to prevent Render.com free tier from sleeping
const selfPingUrl = `https://task-manager-new-aol9.onrender.com`;
const interval = 30000; // 30 seconds

function keepServerAwake() {
  // Only ping if we're in production (Render.com)
  if (process.env.NODE_ENV === 'production') {
    axios
      .get(`${selfPingUrl}/api/health`)
      .then((response) => {
        console.log(`Server kept awake: ${response.status} at ${new Date().toISOString()}`);
      })
      .catch((error) => {
        console.error(`Keep-alive ping failed: ${error.message}`);
      });
  }
}

// Start keep-alive ping in production
if (process.env.NODE_ENV === 'production') {
  setInterval(keepServerAwake, interval);
  console.log(`Keep-alive ping started for: ${selfPingUrl}`);
}

app.post('/api/register', async (req, res) => {
    console.log(req.body);
    try {
        const newPassword = await bcrypt.hash(req.body.password, 10);
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: newPassword,
        });
        res.json({ status: 'ok' });
    } catch (err) {
        res.json({ status: 'error', error: 'Duplicate email' });
    }
});

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
    });

    if (!user) {
        return res.json({ status: 'error', error: 'Invalid login' });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if (isPasswordValid) {
        const token = jwt.sign(
            {
                name: user.name,
                email: user.email,
                _id: user._id
            },
            process.env.JWT_SECRET
        );

        return res.json({ status: 'ok', user: token });
    } else {
        return res.json({ status: 'error', user: false });
    }
});


// Task endpoints

//Create Task
app.post('/api/tasks', async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded._id;

        const { name } = req.body;
        const task = await Task.create({ name, user: userId });

        res.json({ status: 'ok', task });
    } catch (err) {
        console.error(err);
        res.json({ status: 'error', error: 'Failed to create task' });
    }
});

// Update a task
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded._id;

        const { id } = req.params;
        const { name, status } = req.body;

        const updatedTask = await Task.findOneAndUpdate(
            { _id: id, user: userId },
            { name, status },
            { new: true }
        );

        res.json({ status: 'ok', task: updatedTask });
    } catch (err) {
        console.error(err);
        res.json({ status: 'error', error: 'Failed to update task' });
    }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded._id;

        const { id } = req.params;

        await Task.findOneAndDelete({ _id: id, user: userId });

        res.json({ status: 'ok' });
    } catch (err) {
        console.error(err);
        res.json({ status: 'error', error: 'Failed to delete task' });
    }
});

// Get tasks for a specific user
app.get('/api/tasks', async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded._id;

        let query = { user: userId };

        // Handle input search
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            query.name = searchRegex;
        }

        // Handle dropdown filter
        if (req.query.status && req.query.status !== 'all') {
            query.status = req.query.status;
        }

        const tasks = await Task.find(query);

        res.json({ status: 'ok', tasks });
    } catch (err) {
        console.error(err);
        res.json({ status: 'error', error: 'Failed to fetch tasks' });
    }
});

const PORT = process.env.PORT || 1337;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});