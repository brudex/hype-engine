const express = require("express");
const cors = require('cors');
const morgan = require("morgan");
const compression = require('compression');
const logger = require('./utils/logger');
const jobRunner = require('./job-runner'); // registers all cron jobs (see job-runner/index.js)

const app = express();
app.locals.jobRunner = jobRunner;

// Basic middleware
app.use(morgan("dev"));
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: false, limit: '100mb' }));

app.set('trust proxy', 1);

// Health check endpoint for job server
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'job-server' });
});

// Job status endpoint (can be extended for job management API)
app.get('/jobs/status', (req, res) => {
    res.json({
        status: 'running',
        service: 'job-server',
        crons: jobRunner.registeredCrons.map(({ name, schedule }) => ({ name, schedule }))
    });
});

// Error handlers
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.message = `The requested resource ${req.url} was not found.`;
    logger.error(err);
    err.status = 404;
    next(err);
});

if(app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        console.log(err);
        res.status(err.status || 500);
        res.json({ error: err.message });
    });
}

app.use((err, req, res, next) => {
    console.error(err.stack);
    logger.error('Unhandled error:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method
    });
    res.status(500).json({
        status: '500',
        message: 'Something went wrong!'
    });
});

module.exports = app;
