const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

// Simulate sensor data
app.get('/api/data', (req, res) => {
    const data = [];
    for(let i=1;i<=5;i++){
        data.push({ meter_id: 'WM-'+i, usage: Math.floor(Math.random()*100) });
    }
    res.json(data);
});

app.listen(port, () => { console.log(`Server running on port ${port}`); });
