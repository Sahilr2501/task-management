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
const frontendPath = process.env.NODE_ENV === 'production'
    ? join(__dirname, '../../task-manager-frontend/dist')
    : join(__dirname, '../task-manager-frontend/dist');

app.use(express.static(frontendPath));

// Handle React routing, return all requests to React app
app.get('/', (req, res) => {
    res.sendFile(join(frontendPath, 'index.js'));
});

// Handle all other routes
app.get('/:path', (req, res) => {
    res.sendFile(join(frontendPath, 'index.js'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
