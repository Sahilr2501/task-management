import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();
console.log("Loaded MONGODB_URI:", process.env.MONGODB_URI);
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());

// API routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Serve static files from the React app
app.use(express.static(join(__dirname, '../task-manager-frontend/dist')));

// Handle React routing, return all requests to React app
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '../task-manager-frontend/dist/index.html'));
});

// Handle all other routes
app.get('/:path', (req, res) => {
    res.sendFile(join(__dirname, '../task-manager-frontend/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
