const express = require('express');
const router = express.Router();

// Mock database
let clients = [];

// GET all clients
router.get('/', (req, res) => {
    res.json(clients);
});

// POST create client
router.post('/', (req, res) => {
    const newClient = {
        id: String(clients.length + 1),
        ...req.body
    };
    clients.push(newClient);
    res.status(201).json(newClient);
});

module.exports = router;
