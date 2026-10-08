const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');

dotenv.config();

const app = express();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { message: 'too many login attempts, try again in 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.set('etag', false);

app.use(cors());
app.use(express.json({ limit: '400kb' }));

const noStore = (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
};

app.use('/auth/login', loginLimiter);
app.use('/auth', noStore, authRoutes);
app.use('/account', noStore, accountRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});