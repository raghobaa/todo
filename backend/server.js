import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔍 DEBUG: Log all incoming requests
app.use((req, res, next) => {
    console.log(`\n🔵 [${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
        const logBody = { ...req.body };
        if (logBody.password) logBody.password = '***';
        console.log('📦 Request body:', logBody);
    }
    next();
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.json({ message: 'ToDo Manager API is running' });
});

// 🔍 DEBUG: Database connection test route
app.get('/api/db-test', async (req, res) => {
    try {
        const state = mongoose.connection.readyState;
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };

        // If disconnected, try to reconnect to capture error
        if (state === 0) {
            try {
                await mongoose.connect(process.env.MONGODB_URI);
            } catch (connErr) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Failed to reconnect',
                    error: connErr.message,
                    state: states[mongoose.connection.readyState]
                });
            }
        }

        res.json({
            status: 'success',
            message: 'Database connection check',
            state: states[mongoose.connection.readyState],
            host: mongoose.connection.host,
            dbName: mongoose.connection.name
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Database check failed',
            error: error.message
        });
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
