const express = require('express');
const router = express.Router();

// Mock database
let sessions = [];

// GET all sessions
router.get('/', (req, res) => {
    res.json(sessions);
});

// GET session by ID
router.get('/:id', (req, res) => {
    const session = sessions.find(s => s.id === req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
});

// POST create session
router.post('/', (req, res) => {
    const newSession = {
        id: String(sessions.length + 1),
        coachId: req.body.coachId,
        clientId: req.body.clientId,
        date: new Date().toISOString(),
        nodes: [], // Relationship nodes
        status: 'active'
    };
    sessions.push(newSession);
    res.status(201).json(newSession);
});

// POST add node to session
router.post('/:id/nodes', (req, res) => {
    const session = sessions.find(s => s.id === req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const newNode = {
        id: String(session.nodes.length + 1),
        name: req.body.name,
        role: req.body.role,
        category: req.body.category, // ProActive category
        valence: null // To be assessed
    };

    session.nodes.push(newNode);
    res.status(201).json(newNode);
});

// PUT update valence for a node
router.put('/:id/nodes/:nodeId/valence', (req, res) => {
    const session = sessions.find(s => s.id === req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const node = session.nodes.find(n => n.id === req.params.nodeId);
    if (!node) return res.status(404).json({ message: 'Node not found' });

    // Validate range -5 to +5
    const { trust, communication, support, respect, alignment } = req.body;

    // Basic validation (could be more robust based on spec)
    const scores = [trust, communication, support, respect, alignment];
    if (scores.some(s => s < -5 || s > 5)) {
        return res.status(400).json({ message: 'Scores must be between -5 and +5' });
    }

    node.valence = {
        trust,
        communication,
        support,
        respect,
        alignment,
        average: scores.reduce((a, b) => a + b, 0) / 5
    };

    res.json(node);
});

module.exports = router;
