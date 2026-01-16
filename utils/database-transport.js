const winston = require('winston');
const { Transform } = require('stream');

/**
 * Custom Winston Transport for Database Logging
 * Stores logs in the database using Sequelize
 */
class DatabaseTransport extends winston.Transport {
    constructor(options = {}) {
        super(options);
        
        this.name = 'database';
        this.level = options.level || 'info';
        this.db = options.db; // Sequelize models
        this.batchSize = options.batchSize || 10; // Number of logs to batch before writing
        this.batchInterval = options.batchInterval || 5000; // Milliseconds to wait before flushing batch
        this.logBuffer = [];
        this.batchTimer = null;
        this.isFlushing = false;
        
        // Ensure db is provided
        if (!this.db) {
            throw new Error('Database models (db) must be provided to DatabaseTransport');
        }
        
        // Start batch timer
        this.startBatchTimer();
    }
    
    /**
     * Start the batch timer to periodically flush logs
     */
    startBatchTimer() {
        if (this.batchTimer) {
            clearInterval(this.batchTimer);
        }
        
        this.batchTimer = setInterval(() => {
            this.flushBatch();
        }, this.batchInterval);
    }
    
    /**
     * Flush buffered logs to database
     */
    async flushBatch() {
        if (this.isFlushing || this.logBuffer.length === 0) {
            return;
        }
        
        this.isFlushing = true;
        const logsToWrite = [...this.logBuffer];
        this.logBuffer = [];
        
        try {
            // Write logs in batch
            await this.db.Log.bulkCreate(logsToWrite, {
                ignoreDuplicates: true,
                validate: false // Skip validation for performance
            });
            
            this.emit('logged', { count: logsToWrite.length });
        } catch (error) {
            // If database write fails, log to console as fallback
            console.error('Database transport error:', error.message);
            this.emit('error', error);
        } finally {
            this.isFlushing = false;
        }
    }
    
    /**
     * Log method required by Winston
     */
    log(info, callback) {
        setImmediate(() => {
            this.emit('logged', info);
        });
        
        // Sanitize and prepare log entry
        const logEntry = this.prepareLogEntry(info);
        
        // Add to buffer
        this.logBuffer.push(logEntry);
        
        // Flush if buffer is full
        if (this.logBuffer.length >= this.batchSize) {
            this.flushBatch();
        }
        
        callback();
    }
    
    /**
     * Prepare log entry for database storage
     */
    prepareLogEntry(info) {
        const { level, message, timestamp, service, ...meta } = info;
        
        // Clean up meta object (remove circular references and large objects)
        const cleanMeta = this.sanitizeMeta(meta);
        
        return {
            level: level || 'info',
            message: message || '',
            meta: Object.keys(cleanMeta).length > 0 ? cleanMeta : null,
            service: service || 'mixpost-node-better',
            createdAt: timestamp ? new Date(timestamp) : new Date(),
            updatedAt: new Date()
        };
    }
    
    /**
     * Sanitize meta object to remove circular references and large objects
     */
    sanitizeMeta(meta) {
        const seen = new WeakSet();
        const maxDepth = 5;
        
        const sanitize = (obj, depth = 0) => {
            if (depth > maxDepth) {
                return '[Max Depth Reached]';
            }
            
            if (obj === null || obj === undefined) {
                return obj;
            }
            
            // Handle primitives
            if (typeof obj !== 'object') {
                return obj;
            }
            
            // Handle arrays
            if (Array.isArray(obj)) {
                return obj.map(item => sanitize(item, depth + 1));
            }
            
            // Handle circular references
            if (seen.has(obj)) {
                return '[Circular]';
            }
            seen.add(obj);
            
            // Handle special objects
            if (obj instanceof Error) {
                return {
                    message: obj.message,
                    stack: obj.stack,
                    name: obj.name,
                    code: obj.code
                };
            }
            
            if (obj instanceof Date) {
                return obj.toISOString();
            }
            
            // Handle request/response objects
            if (obj.req || obj.res || obj.request || obj.response) {
                return {
                    method: obj.method || obj.req?.method,
                    url: obj.url || obj.req?.url,
                    status: obj.status || obj.res?.statusCode,
                    statusCode: obj.statusCode || obj.res?.statusCode
                };
            }
            
            // Recursively sanitize object properties
            const sanitized = {};
            for (const key in obj) {
                // Skip sensitive fields
                if (['password', 'token', 'accessToken', 'refreshToken', 'secret', 'apiKey'].includes(key.toLowerCase())) {
                    sanitized[key] = '[REDACTED]';
                    continue;
                }
                
                // Skip internal properties
                if (key.startsWith('_') || key === 'socket' || key === 'client') {
                    continue;
                }
                
                try {
                    sanitized[key] = sanitize(obj[key], depth + 1);
                } catch (e) {
                    sanitized[key] = '[Error serializing]';
                }
            }
            
            return sanitized;
        };
        
        return sanitize(meta);
    }
    
    /**
     * Close the transport and flush remaining logs
     */
    close() {
        if (this.batchTimer) {
            clearInterval(this.batchTimer);
            this.batchTimer = null;
        }
        
        // Flush remaining logs
        return this.flushBatch();
    }
}

module.exports = DatabaseTransport;
