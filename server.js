const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from public folder
app.use(express.static('public'));

// Mock API endpoint
app.get('/api/data', (req, res) => {
    res.json({
        totalUsage: 1234,
        dailyUsage: {
            "2025-08-10": 100,
            "2025-08-11": 150,
            "2025-08-12": 120,
            "2025-08-13": 180,
            "2025-08-14": 200
        }
    });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
