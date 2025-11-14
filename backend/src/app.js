const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth');

const app = express();

const parseOrigins = () => {
  const raw = process.env.CORS_ORIGIN;

  if (!raw) {
    return ['http://localhost:3000'];
  }

  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const allowedOrigins = parseOrigins();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRouter);

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.status || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;

  res.status(statusCode).json({
    message,
  });
});

module.exports = app;

