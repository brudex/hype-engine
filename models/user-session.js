module.exports = (sequelize, DataTypes) => {
	const UserSession = sequelize.define("UserSession", {
		sid: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		expires: {
			type: DataTypes.DATE,
		},
		data: {
			type: DataTypes.TEXT,
		},
	},{
		tableName: "admin_sessions",
		timestamps: true

	});

	return UserSession;
};
