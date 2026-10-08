const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const MAX_AVATAR_LENGTH = 300000;
const AVATAR_PATTERN = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;

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

router.post('/downgrade', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            "UPDATE users SET plan = 'free' WHERE id = $1 RETURNING plan",
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

router.post('/avatar', authMiddleware, async (req, res) => {
    const { avatar } = req.body;

    if (typeof avatar !== 'string' || avatar.length > MAX_AVATAR_LENGTH || !AVATAR_PATTERN.test(avatar)) {
        return res.status(400).json({ message: 'invalid image' });
    }

    try {
        const result = await pool.query(
            'UPDATE users SET avatar = $1 WHERE id = $2 RETURNING avatar',
            [avatar, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'user not found' });
        }

        res.json({ avatar: result.rows[0].avatar });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'server error' });
    }
});

router.delete('/avatar', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            'UPDATE users SET avatar = NULL WHERE id = $1 RETURNING id',
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'user not found' });
        }

        res.json({ avatar: null });
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