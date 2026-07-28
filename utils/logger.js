const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const DatabaseTransport = require('./database-transport');

// Custom format for better readability
const customFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
        }`;
    })
);

// Initialize logger with default transports
const transports = [
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            customFormat
        )
    }),
    new DailyRotateFile({
        filename: 'logs/app-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxSize: '10m',
        maxFiles: '14d'
    }),
    new DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxSize: '10m',
        maxFiles: '14d',
        level: 'error'
    })
];

// Add database transport if db is available
// This will be set after models are initialized
let dbTransport = null;

/**
 * Initialize database transport
 * Call this after models are loaded
 */
function initializeDatabaseTransport(db) {
    if (!db || !db.Log) {
        console.warn('Database transport not initialized: Log model not found');
        return;
    }
    
    try {
        dbTransport = new DatabaseTransport({
            db: db,
            level: process.env.DB_LOG_LEVEL || 'info',
            batchSize: parseInt(process.env.DB_LOG_BATCH_SIZE || '10'),
            batchInterval: parseInt(process.env.DB_LOG_BATCH_INTERVAL || '5000')
        });
        
        logger.add(dbTransport);
        
        console.log('Database transport initialized successfully');
    } catch (error) {
        console.error('Failed to initialize database transport:', error.message);
    }
}

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: customFormat,
    transports: transports
});

// Helper function to safely serialize objects (handles circular references)
function safeStringify(obj) {
    const seen = new WeakSet();
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return '[Circular]';
            }
            seen.add(value);
        }
        // Filter out request/response objects that cause circular references
        if (key === 'req' || key === 'res' || key === 'socket' || key === 'client' || key === 'response' || key === 'request') {
            return '[Object]';
        }
        return value;
    }, 2);
}

// Export a wrapper with common logging patterns
module.exports = {
    initializeDatabaseTransport,
    // Direct logger access
    logger: logger,
    
    // Wrapper methods
    info: (message, meta = {}) => {
        try {
            logger.info(message, meta);
        } catch (e) {
            logger.info(message, { error: 'Failed to log meta data' });
        }
    },
    error: (message, error = null) => {
        try {
            const meta = error ? {
                error: {
                    message: error.message || 'Unknown error',
                    stack: error.stack || 'No stack trace',
                    code: error.code,
                    status: error.status || error.statusCode,
                    response: error.response ? {
                        status: error.response.status,
                        statusText: error.response.statusText
                    } : undefined
                }
            } : {};
            logger.error(message, meta);
        } catch (e) {
            logger.error(message, { 
                error: {
                    message: error?.message || 'Unknown error',
                    loggingError: 'Failed to serialize error object'
                }
            });
        }
    },
    warn: (message, meta = {}) => {
        try {
            logger.warn(message, meta);
        } catch (e) {
            logger.warn(message, { error: 'Failed to log meta data' });
        }
    },
    debug: (message, meta = {}) => {
        try {
            logger.debug(message, meta);
        } catch (e) {
            logger.debug(message, { error: 'Failed to log meta data' });
        }
    },
    http: (message, meta = {}) => {
        try {
            logger.http(message, meta);
        } catch (e) {
            logger.http(message, { error: 'Failed to log meta data' });
        }
    }
};
