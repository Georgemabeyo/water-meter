const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

// Mock users data
const users = [
  { username: "user101", password: "1234", room: "101" },
  { username: "user102", password: "1234", room: "102" }
];

// Mock water data
const waterData = {
  "101": {
    room: "101",
    currentUsage: 12,
    totalUsage: 234,
    amountDue: 5600,
    lastReading: "2025-08-16",
    dailyUsage: { "2025-08-10": 10, "2025-08-11": 12, "2025-08-12": 8 },
    monthlyUsage: { "Jan": 120, "Feb": 135, "Mar": 140 }
  },
  "102": {
    room: "102",
    currentUsage: 20,
    totalUsage: 400,
    amountDue: 10000,
    lastReading: "2025-08-16",
    dailyUsage: { "2025-08-10": 15, "2025-08-11": 18, "2025-08-12": 20 },
    monthlyUsage: { "Jan": 200, "Feb": 180, "Mar": 220 }
  }
};

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    req.session.user = user;
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "Invalid credentials" });
  }
});

// Logout
app.get('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Get water data for logged-in user
app.get('/api/data', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "Not logged in" });
  const room = req.session.user.room;
  res.json(waterData[room]);
});

// Start server
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
