import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date is required']
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Completed'],
        default: 'To Do'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notifications: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        message: String,
        read: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Index for search functionality
taskSchema.index({ title: 'text', description: 'text' });

// Method to check if task is overdue
taskSchema.methods.isOverdue = function () {
    return this.status !== 'Completed' && this.dueDate < new Date();
};

// Method to add notification
taskSchema.methods.addNotification = function (userId, message) {
    this.notifications.push({
        user: userId,
        message,
        read: false
    });
    return this.save();
};

const Task = mongoose.model('Task', taskSchema);
export default Task;
