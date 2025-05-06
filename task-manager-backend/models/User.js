import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'manager', 'user'],
        default: 'user'
    },
    notificationPreferences: {
        email: {
            type: Boolean,
            default: true
        },
        inApp: {
            type: Boolean,
            default: true
        },
        taskUpdates: {
            type: Boolean,
            default: true
        },
        taskAssignments: {
            type: Boolean,
            default: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user has required role
userSchema.methods.hasRole = function (role) {
    const roleHierarchy = {
        'admin': ['admin', 'manager', 'user'],
        'manager': ['manager', 'user'],
        'user': ['user']
    };
    return roleHierarchy[this.role].includes(role);
};

const User = mongoose.model('User', userSchema);

export default User;
