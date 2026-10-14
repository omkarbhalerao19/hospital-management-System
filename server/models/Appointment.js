// server/models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorName: { type: String, required: true },
    specialization: { type: String, required: true },
    roomNo: { type: String, required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    tokenNumber: { type: String, required: true },
    status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
    createdAt: { type: Date, default: Date.now }
});

appointmentSchema.index({ doctorName: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);