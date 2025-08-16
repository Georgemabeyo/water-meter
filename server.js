// server.js
const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
    secret: 'watermetersecret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// Rooms data (simulate 10 rooms)
const rooms = {};
for (let i = 1; i <= 10; i++) {
    const id = `R${i.toString().padStart(3, '0')}`; // Unique room ID: R001, R002...
    rooms[id] = {
        room: id,
        currentUsage: Math.floor(Math.random() * 20),
        totalUsage: Math.floor(Math.random() * 500),
        amountDue: Math.floor(Math.random() * 10000),
        lastReading: new Date().toISOString().split('T')[0],
        dailyUsage: {
            "2025-08-10": Math.floor(Math.random() * 20),
            "2025-08-11": Math.floor(Math.random() * 20),
            "2025-08-12": Math.floor(Math.random() * 20)
        },
        monthlyUsage: {
            Jan: Math.floor(Math.random() * 200),
            Feb: Math.floor(Math.random() * 200),
            Mar: Math.floor(Math.random() * 200)
        }
    };
}

// Login route (user selects room)
app.post('/login', (req, res) => {
    const { roomId } = req.body;
    if (!roomId || !rooms[roomId]) return res.status(400).json({ error: "Invalid room ID" });

    req.session.user = { roomId };
    res.json({ message: "Logged in", roomId });
});

// Logout
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: "Logged out" });
});

// API to get room-specific water usage
app.get('/api/data', (req, res) => {
    let data;

    if (req.session.user && rooms[req.session.user.roomId]) {
        data = rooms[req.session.user.roomId];
    } else {
        // Public demo data
        data = {
            room: "Demo Room",
            currentUsage: 12,
            totalUsage: 234,
            amountDue: 5600,
            lastReading: "2025-08-16",
            dailyUsage: {
                "2025-08-10": 10,
                "2025-08-11": 12,
                "2025-08-12": 8
            },
            monthlyUsage: {
                Jan: 120,
                Feb: 135,
                Mar: 140
            }
        };
    }

    res.json(data);
});

// Serve index.html for any other route (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
