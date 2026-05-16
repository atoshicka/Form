const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

router.post('/register', async (req, res) => {
    const { login, password, email } = req.body;

    try {
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE login = $1 OR email = $2',
            [login, email]
        );

        if (existingUser.rows.length > 0) {
            const taken = existingUser.rows[0];
            if (taken.login === login) {
                return res.status(400).json({ message: 'login is already taken' });
            }
            if (taken.email === email) {
                return res.status(400).json({ message: 'this email is already registered' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO users (login, password, email) VALUES ($1, $2, $3)',
            [login, hashedPassword, email]
        );

        res.status(201).json({ message: 'user is registered' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'server error' });
    }
});

router.post('/login', async (req, res) => {
    const { login, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE login = $1',
            [login]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'incorrect login or password' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'incorrect login or password' });
        }

        const token = jwt.sign(
            { id: user.id, login: user.login },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'server error' });
    }
});

module.exports = router;