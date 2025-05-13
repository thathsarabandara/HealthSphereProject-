const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    staffId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: ['doctor', 'nurse', 'staff'],
        required: true
    },
    department: {
        type: String,
        required: false
    },
    specialization: {
        type: String,
        required: function() {
            return this.role === 'doctor';
        }
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'on_leave'],
        default: 'active'
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String
    },
    qualifications: [{
        degree: String,
        institution: String,
        year: Number
    }],
    experience: [{
        position: String,
        hospital: String,
        from: Date,
        to: Date,
        current: Boolean
    }],
    schedule: {
        days: [{
            type: String,
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        }],
        startTime: String,
        endTime: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Generate staff ID before saving
staffSchema.pre('save', async function(next) {
    if (this.isNew) {
        const prefix = this.role === 'doctor' ? 'DOC' : this.role === 'nurse' ? 'NUR' : 'STF';
        const count = await this.constructor.countDocuments({ role: this.role });
        this.staffId = `${prefix}${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Staff', staffSchema);
