const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from current directory
app.use(express.static(__dirname));

// Route to VIB34D System (main)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'VIB34D_SYSTEM.html'));
});

app.get('/system', (req, res) => {
    res.sendFile(path.join(__dirname, 'VIB34D_SYSTEM.html'));
});

app.get('/modular', (req, res) => {
    res.sendFile(path.join(__dirname, 'VIB34D_EDITOR_DASHBOARD_MODULAR.html'));
});

app.get('/original', (req, res) => {
    res.sendFile(path.join(__dirname, 'index_VIB34D_PROFESSIONAL.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 VIB34D System Server Running!`);
    console.log(`📍 VIB34D System (Main): http://localhost:${PORT}/`);
    console.log(`📍 System Direct: http://localhost:${PORT}/system`);
    console.log(`📍 Modular Dashboard: http://localhost:${PORT}/modular`);
    console.log(`📍 Original Dashboard: http://localhost:${PORT}/original`);
    console.log(`\n✅ Use Ctrl+C to stop server`);
    console.log(`\n🎯 Phase 1 Complete: JSON-driven static layout with basic theming`);
});