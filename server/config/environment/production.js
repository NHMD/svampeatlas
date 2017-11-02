'use strict';

// Production specific configuration
// =================================
module.exports = {
	// Server IP
	ip: process.env.OPENSHIFT_NODEJS_IP || process.env.IP || undefined,

	// Server port
	port: process.env.NODEJS_PORT || process.env.PORT || 8080,

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
	gbif: {
		UserName: 'UserName',
		Password: 'Password'
	},
	// MongoDB connection options
	mongo: {
		uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME || 'mongodb://localhost/app'
	},
	sequelize: {
		uri: 'mysql://',
		username: process.env.MYSQL_DB_USERNAME,
		password: process.env.MYSQL_DB_PASSWORD,
		database: "database",
		options: {
			logging: false,

			dialect: "mysql", // or 'sqlite', 'postgres', 'mariadb'
			host: process.env.MYSQL_DB_HOST || 'localhost',
			port: process.env.MYSQL_DB_PORT || 3306,
			// or 5432 (for postgres)
			define: {
				timestamps: false
			}
		}
	},
	
	uploaddir: 'uploaddir',
	staticImagePath: 'staticImagePath'

};