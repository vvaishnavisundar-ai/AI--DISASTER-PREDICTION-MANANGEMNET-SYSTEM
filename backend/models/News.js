const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Government Announcement', 'Weather Alert', 'Emergency Broadcast'],
        default: 'Weather Alert'
    },
    severity: {
        type: String,
        enum: ['Info', 'Warning', 'Critical'],
        default: 'Info'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
