const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

router.post('/upgrade', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            "UPDATE users SET plan = 'pro' WHERE id = $1 RETURNING plan",
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'user not found' });
        }

        res.json({ plan: result.rows[0].plan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'server error' });
    }
});

router.delete('/', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT plan FROM users WHERE id = $1',
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'user not found' });
        }

        if (result.rows[0].plan !== 'pro') {
            return res.status(403).json({ message: 'deleting an account is available on the pro plan only' });
        }

        await pool.query('DELETE FROM users WHERE id = $1', [req.user.id]);
        res.json({ message: 'account deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'server error' });
    }
});

module.exports = router;