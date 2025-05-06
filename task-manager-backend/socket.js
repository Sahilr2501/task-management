const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

const initializeSocket = (server) => {
    io = socketIO(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            methods: ['GET', 'POST']
        }
    });

    // Authentication middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.user.id);

        // Join user's personal room for notifications
        socket.join(`user_${socket.user.id}`);

        // Join team room if user is part of a team
        if (socket.user.teamId) {
            socket.join(`team_${socket.user.teamId}`);
        }

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.user.id);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

// Notification helper functions
const sendNotification = (userId, notification) => {
    const io = getIO();
    io.to(`user_${userId}`).emit('notification', notification);
};

const sendTeamNotification = (teamId, notification) => {
    const io = getIO();
    io.to(`team_${teamId}`).emit('team_notification', notification);
};

const sendTaskNotification = (taskId, notification) => {
    const io = getIO();
    io.to(`task_${taskId}`).emit('task_notification', notification);
};

module.exports = {
    initializeSocket,
    getIO,
    sendNotification,
    sendTeamNotification,
    sendTaskNotification
}; 