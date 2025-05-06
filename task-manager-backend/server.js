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

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json());

// API routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Serve Next.js static files in production
if (process.env.NODE_ENV === 'production') {
    const nextAppPath = join(__dirname, '../task-manager-frontend/.next');

    // Serve static files from .next/static
    app.use('/_next/static', express.static(join(nextAppPath, 'static')));

    // Serve other static files
    app.use(express.static(join(nextAppPath, 'server/pages')));

    // Handle all routes for Next.js
    app.get('*', (req, res) => {
        res.sendFile(join(nextAppPath, 'server/pages/index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
