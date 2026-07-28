const crypto = require('crypto');
const config = require('../config/config');

/**
 * Encryption utility for service configurations
 * Uses AES-256-GCM encryption similar to Laravel's Crypt
 */

// Derive the encryption key from the required JWT_SECRET configuration.
function getEncryptionKey() {
    // Derive a 32-byte key using SHA-256
    return crypto.createHash('sha256').update(config.jwtSecret).digest();
}

/**
 * Encrypt a string value
 * @param {string} value - The value to encrypt
 * @returns {string} - Encrypted string (base64 encoded)
 */
function encrypt(value) {
    if (!value || value === '') {
        return '';
    }

    try {
        const key = getEncryptionKey();
        const iv = crypto.randomBytes(16); // 128-bit IV for GCM
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

        let encrypted = cipher.update(String(value), 'utf8', 'base64');
        encrypted += cipher.final('base64');
        
        const authTag = cipher.getAuthTag();
        
        // Combine IV, authTag, and encrypted data
        // Format: iv:authTag:encryptedData (all base64)
        const result = [
            iv.toString('base64'),
            authTag.toString('base64'),
            encrypted
        ].join(':');

        return result;
    } catch (error) {
        throw new Error(`Encryption failed: ${error.message}`);
    }
}

/**
 * Decrypt a string value
 * @param {string} encryptedValue - The encrypted string to decrypt
 * @returns {string} - Decrypted string
 */
function decrypt(encryptedValue) {
    if (!encryptedValue || encryptedValue === '') {
        return '';
    }

    try {
        const key = getEncryptionKey();
        const parts = encryptedValue.split(':');
        
        if (parts.length !== 3) {
            // If format doesn't match, might be old unencrypted data
            // Try to return as-is (for backward compatibility during migration)
            return encryptedValue;
        }

        const [ivBase64, authTagBase64, encrypted] = parts;
        const iv = Buffer.from(ivBase64, 'base64');
        const authTag = Buffer.from(authTagBase64, 'base64');
        
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(authTag);
        
        let decrypted = decipher.update(encrypted, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    } catch (error) {
        // If decryption fails, might be unencrypted data (backward compatibility)
        // Log error but return the value as-is
        console.warn(`Decryption failed, returning as-is: ${error.message}`);
        return encryptedValue;
    }
}

/**
 * Encrypt an object/array (converts to JSON first)
 * @param {object|array} data - The data to encrypt
 * @returns {string} - Encrypted JSON string
 */
function encryptObject(data) {
    if (!data) {
        return '';
    }
    const jsonString = JSON.stringify(data);
    return encrypt(jsonString);
}

/**
 * Decrypt and parse JSON object/array
 * @param {string} encryptedValue - The encrypted string
 * @returns {object|array|null} - Decrypted and parsed object/array
 */
function decryptObject(encryptedValue) {
    if (!encryptedValue || encryptedValue === '') {
        return null;
    }
    
    try {
        const decrypted = decrypt(encryptedValue);
        return JSON.parse(decrypted);
    } catch (error) {
        // If parsing fails, might be unencrypted JSON string
        try {
            return JSON.parse(encryptedValue);
        } catch (e) {
            console.warn(`Failed to decrypt/parse object: ${error.message}`);
            return null;
        }
    }
}

module.exports = {
    encrypt,
    decrypt,
    encryptObject,
    decryptObject
};
