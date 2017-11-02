'use strict';

// Development specific configuration
// ==================================
module.exports = {
	// MongoDB connection options
	mongo: {
		uri: 'mongodb://localhost/app-dev'
	},
	sequelize: {
		uri: 'mysql://',
		username: "root",
		password: "password",
		database: "database",
		options: {
			logging: console.log,

			dialect: "mysql", // or 'sqlite', 'postgres', 'mariadb'
			port: 3306, // or 5432 (for postgres)
			define: {
				timestamps: false
			}
		}
	},

	plutof: {
		client_id: 'client_id',
		client_secret: 'client_secret',
		grant_type: 'password',
		username: 'username',
		password: 'password',
		scope: 'read'
	},

	dyntaxa: {
		UserName: 'UserName',
		ApplicationIdentifier: 'ApplicationIdentifier',
		Password: 'Password'
	},
	uploaddir: '../uploads/',
	staticImagePath: './client/assets/images/public/',
	seedDB: false
};
