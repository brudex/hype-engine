const { encryptObject, decryptObject } = require('../utils/encryption');

module.exports = (sequelize, DataTypes) => {
    const OauthService = sequelize.define("OauthService", {
        uuid: {
            type: DataTypes.STRING(36),
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        configuration: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: 'Encrypted JSON configuration'
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: "oauth_services",
        timestamps: false,
        hooks: {
            // Encrypt configuration before saving
            beforeSave: (service, options) => {
                console.log('beforeSave', service.configuration);
                if (service.configuration !== undefined && service.configuration !== null) {
                    // If it's already a string, check if it's encrypted
                    if (typeof service.configuration === 'string') {
                        // Check if it looks encrypted (has colons from our format: iv:authTag:encryptedData)
                        if (service.configuration.includes(':') && service.configuration.split(':').length === 3) {
                            // Already encrypted, don't re-encrypt
                            console.log('already encrypted');
                            return;
                        }
                        // Not encrypted, try to parse as JSON
                        try {
                            const parsed = JSON.parse(service.configuration);
                            service.configuration = encryptObject(parsed);
                        } catch (e) {
                            // Not JSON, wrap in object and encrypt
                            service.configuration = encryptObject({ value: service.configuration });
                        }
                    } else if (typeof service.configuration === 'object') {
                        console.log('encrypting object >>>');
                        // It's an object, encrypt it
                        service.configuration = encryptObject(service.configuration);
                        console.log('encrypted object >>>', service.configuration);
                    }
                }
            },
            // Decrypt configuration after finding
            afterFind: (instances, options) => {
                // Handle both single instance and array of instances
                const processInstance = (instance) => {
                    if (instance && instance.configuration) {
                        try {
                            const decrypted = decryptObject(instance.configuration);
                            if (decrypted !== null) {
                                instance.configuration = decrypted;
                            }
                        } catch (error) {
                            console.warn('Failed to decrypt service configuration:', error);
                            // Keep encrypted value if decryption fails (for backward compatibility)
                        }
                    }
                };

                if (Array.isArray(instances)) {
                    instances.forEach(processInstance);
                } else if (instances) {
                    processInstance(instances);
                }
            }
        }
    });

    OauthService.associate = function(models) {
        // Services don't have direct relationships
    };

    return OauthService;
};

