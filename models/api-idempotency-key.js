module.exports = (sequelize, DataTypes) => {
    const ApiIdempotencyKey = sequelize.define('ApiIdempotencyKey', {
        uuid: {
            type: DataTypes.STRING(36),
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false
        },
        userUuid: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        apiKeyUuid: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        key: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        method: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        path: {
            type: DataTypes.STRING(1024),
            allowNull: false
        },
        fingerprint: {
            type: DataTypes.STRING(64),
            allowNull: false
        },
        state: {
            type: DataTypes.STRING(16),
            allowNull: false,
            defaultValue: 'processing'
        },
        statusCode: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        responseBody: {
            type: DataTypes.JSON,
            allowNull: true
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'api_idempotency_keys',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['userUuid', 'apiKeyUuid', 'method', 'path', 'key'],
                name: 'api_idempotency_keys_request_unq'
            },
            { fields: ['expiresAt'] }
        ]
    });

    return ApiIdempotencyKey;
};
