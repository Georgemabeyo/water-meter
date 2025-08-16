const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
    secret: 'watermetersecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: 'lax'
    }
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Login route
app.post('/login', (req, res) => {
    const { room } = req.body;
    if(!room) return res.status(400).json({ error: "Room required" });
    req.session.user = { room };
    res.json({ message: "Logged in", room });
});

// Logout
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) return res.status(500).json({ error: "Logout failed" });
        res.json({ message: "Logged out" });
    });
});

// API to get user-specific data
app.get('/api/data', (req, res) => {
    if(req.session.user){
        const room = req.session.user.room;
        const data = {
            room,
            currentUsage: Math.floor(Math.random()*20),
            totalUsage: Math.floor(Math.random()*500),
            amountDue: Math.floor(Math.random()*10000),
            lastReading: new Date().toISOString().split('T')[0],
            dailyUsage: {
                "2025-08-10": Math.floor(Math.random()*20),
                "2025-08-11": Math.floor(Math.random()*20),
                "2025-08-12": Math.floor(Math.random()*20)
            },
            monthlyUsage: {
                Jan: Math.floor(Math.random()*200),
                Feb: Math.floor(Math.random()*200),
                Mar: Math.floor(Math.random()*200)
            }
        };
        return res.json(data);
    }
    // Not logged in → Demo
    res.json({
        room: "Demo Room",
        currentUsage: 12,
        totalUsage: 234,
        amountDue: 5600,
        lastReading: "2025-08-16",
        dailyUsage: { "2025-08-10": 10, "2025-08-11": 12, "2025-08-12": 8 },
        monthlyUsage: { Jan:120, Feb:135, Mar:140 }
    });
});

// SPA fallback
app.get('*', (req,res)=> res.sendFile(path.join(__dirname,'public','index.html')));

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
