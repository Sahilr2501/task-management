import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Completed'],
        default: 'To Do'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recurring: {
        isRecurring: {
            type: Boolean,
            default: false
        },
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', null],
            default: null
        },
        endDate: {
            type: Date,
            default: null
        }
    },
    auditLog: [{
        action: {
            type: String,
            enum: ['created', 'updated', 'assigned', 'deleted', 'status_changed'],
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        details: {
            type: String
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
taskSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Method to add audit log entry
taskSchema.methods.addAuditLog = function (action, userId, details) {
    this.auditLog.push({
        action,
        user: userId,
        details
    });
    return this.save();
};

// Method to generate next recurring task
taskSchema.methods.generateNextRecurringTask = function () {
    if (!this.recurring.isRecurring) return null;

    const nextTask = this.toObject();
    delete nextTask._id;
    delete nextTask.auditLog;

    const now = new Date();
    let nextDate = new Date(this.dueDate);

    switch (this.recurring.frequency) {
        case 'daily':
            nextDate.setDate(nextDate.getDate() + 1);
            break;
        case 'weekly':
            nextDate.setDate(nextDate.getDate() + 7);
            break;
        case 'monthly':
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
        default:
            return null;
    }

    // Check if we've reached the end date
    if (this.recurring.endDate && nextDate > this.recurring.endDate) {
        return null;
    }

    nextTask.dueDate = nextDate;
    nextTask.status = 'To Do';
    nextTask.createdAt = now;
    nextTask.updatedAt = now;

    return nextTask;
};

const Task = mongoose.model('Task', taskSchema);

export default Task;
