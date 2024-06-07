// server.js
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user.model');
const Task = require('./models/task.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://parakhdas45:parakhdas45@cluster0.3zbpy7a.mongodb.net/database?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('strictQuery', true);

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
            'secret123'
        );

        return res.json({ status: 'ok', user: token });
    } else {
        return res.json({ status: 'error', user: false });
    }
});

// app.get('/api/quote', async (req, res) => {
//     const token = req.headers['x-access-token'];

//     try {
//         const decoded = jwt.verify(token, 'secret123');
//         const email = decoded.email;
//         const user = await User.findOne({ email: email });

//         return res.json({ status: 'ok', quote: user.quote });
//     } catch (error) {
//         console.log(error);
//         res.json({ status: 'error', error: 'invalid token' });
//     }
// });

// app.post('/api/quote', async (req, res) => {
//     const token = req.headers['x-access-token'];

//     try {
//         const decoded = jwt.verify(token, 'secret123');
//         const email = decoded.email;
//         await User.updateOne(
//             { email: email },
//             { $set: { quote: req.body.quote } }
//         );

//         return res.json({ status: 'ok' });
//     } catch (error) {
//         console.log(error);
//         res.json({ status: 'error', error: 'invalid token' });
//     }
// });

// Task endpoints
//Create Task
app.post('/api/tasks', async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        const decoded = jwt.verify(token, 'secret123');
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
        const decoded = jwt.verify(token, 'secret123');
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
        const decoded = jwt.verify(token, 'secret123');
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
        const decoded = jwt.verify(token, 'secret123');
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

app.listen(1337, () => {
    console.log('Server started on port 1337');
});