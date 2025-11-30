const express = require('express');
const router = express.Router();

// Mock database
let coaches = [
    { id: '1', name: 'Jane Doe', email: 'jane@example.com', certification_status: 'active', certification_date: '2024-01-15' }
];

// GET all coaches
router.get('/', (req, res) => {
    res.json(coaches);
});

// GET coach by ID
router.get('/:id', (req, res) => {
    const coach = coaches.find(c => c.id === req.params.id);
    if (!coach) return res.status(404).json({ message: 'Coach not found' });
    res.json(coach);
});

// POST create coach
router.post('/', (req, res) => {
    const newCoach = {
        id: String(coaches.length + 1),
        ...req.body,
        certification_status: req.body.certification_status || 'pending'
    };
    coaches.push(newCoach);
    res.status(201).json(newCoach);
});

module.exports = router;
