// server/models/CommunityPost.js
const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    category: { type: String, enum: ['Blood Emergency', 'Medical Equipment Share', 'Health Camp'], required: true },
    bloodGroupNeeded: { type: String, default: 'N/A' },
    description: { type: String, required: true },
    hospitalOrLocation: { type: String, required: true },
    contactPhone: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Resolved'], default: 'Active' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CommunityPost', communityPostSchema);