const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectDB = require('./config/db');
const User = require('./models/user');
const Appointment = require('./models/Appointment');
const CommunityPost = require('./models/CommunityPost');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const {
        name,
        email,
        password,
        bloodGroup,
        phone
        } = req.body;

        const role = 'Patient';
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "Email already registered." });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            bloodGroup,
            phone
        });


        res.status(201).json({ 
            message: "Registration successful!", 
            user: { id: user._id, name: user.name, email: user.email, role: user.role } 
        });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ error: "Server error during registration." });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid email or password." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid email or password." });

        res.json({ 
            message: "Login successful!", 
            user: { id: user._id, name: user.name, email: user.email, role: user.role, bloodGroup: user.bloodGroup } 
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Server error during login." });
    }
});

// --- OPD APPOINTMENT ROUTES ---
app.get('/api/appointments', async (req, res) => {
    try {
        const apps = await Appointment.find({}).populate('patient', 'name email phone').sort({ createdAt: -1 });
        res.json(apps);
    } catch (err) {
        console.error("Fetch Appointments Error:", err);
        res.status(500).json({ error: "Failed to fetch appointments" });
    }
});

app.post('/api/appointments', async (req, res) => {
    try {
        const { patientId, doctorName, specialization, roomNo, date, timeSlot } = req.body;
        const existing = await Appointment.findOne({ doctorName, date, timeSlot, status: 'Scheduled' });
        if (existing) return res.status(409).json({ error: "Time slot already booked for this doctor." });

        const count = await Appointment.countDocuments({ date });
        const tokenNumber = `OPD-${String(count + 1).padStart(3, '0')}`;

        const appointment = await Appointment.create({
            patient: patientId, 
            doctorName, 
            specialization, 
            roomNo, 
            date, 
            timeSlot, 
            tokenNumber,
            status: 'Scheduled'
        });

        res.status(201).json({ message: "Appointment booked!", appointment });
    } catch (err) {
        console.error("Create Appointment Error:", err);
        res.status(500).json({ error: "Server error booking appointment." });
    }
});

// --- COMMUNITY HELP FEED ROUTES ---
app.get('/api/community', async (req, res) => {
    try {
        const posts = await CommunityPost.find({ status: 'Active' }).populate('author', 'name phone').sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        console.error("Fetch Community Posts Error:", err);
        res.status(500).json({ error: "Failed to fetch community posts" });
    }
});

app.post('/api/community', async (req, res) => {
    try {
        const { authorId, title, category, bloodGroupNeeded, description, hospitalOrLocation, contactPhone } = req.body;
        const post = await CommunityPost.create({
            author: authorId, 
            title, 
            category, 
            bloodGroupNeeded, 
            description, 
            hospitalOrLocation, 
            contactPhone,
            status: 'Active'
        });
        res.status(201).json({ message: "Community alert posted successfully!", post });
    } catch (err) {
        console.error("Create Community Post Error:", err);
        res.status(500).json({ error: "Failed to post community alert." });
    }
});

app.patch('/api/community/:id/resolve', async (req, res) => {
    try {
        const post = await CommunityPost.findByIdAndUpdate(
            req.params.id, 
            { status: 'Resolved' }, 
            { new: true }
        );
        res.json({ message: "Post marked as resolved", post });
    } catch (err) {
        console.error("Resolve Community Post Error:", err);
        res.status(500).json({ error: "Failed to update status" });
    }
});

// Catch-all route to support frontend client-side routing (Place before app.listen)
app.get('*', (req, res) => {
    res.sendFile(
        path.join(__dirname, '..', 'public', 'index.html')
    );
});

app.listen(PORT, () => {
    console.log(`MediCore Community Ecosystem live at http://localhost:${PORT}`);
});