'use strict';

// Production specific configuration
// =================================
module.exports = {
	// Server IP
	ip: process.env.OPENSHIFT_NODEJS_IP || process.env.IP || undefined,

	// Server port
	port: process.env.NODEJS_PORT || process.env.PORT || 8080,

	plutof: {
		client_id: 'fJ43ypTmHBhsNjr6NoxqJ3MN7FbSmnD3anNp5Q16',
		client_secret: 'sukZIxGIgusbE67TkURKmjvHcixd5l1uEqdXlZ9kWEHD7WIV0xmnH01BtOrHXmYQGQk63Tdxd2xOVXQeP00rXb7ZM0c5yfagm97vLoPZEqROeTDg8li8waSNc8tb2cR8',
		grant_type: 'password',
		username: 'svampeatlas',
		password: 'selandicus031003',
		scope: 'read'
	},

	dyntaxa: {
		UserName: 'Svampeatlas',
		ApplicationIdentifier: 'Svampeatlas',
		Password: 'VAtEpVdLDFZd%HdaumA4aWsSDaP+tM'
	},
	gbif: {
		UserName: 'danish_mycological_society',
		Password: '1BtOrHXmYQGQk63T'
	},
	// MongoDB connection options
	mongo: {
		uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME || 'mongodb://localhost/app'
	},
	sequelize: {
		uri: 'mysql://',
		username: process.env.MYSQL_DB_USERNAME,
		password: process.env.MYSQL_DB_PASSWORD,
		database: "svampeatlas",
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
	
	uploaddir: '/home/atlas/uploads/',
	/*
  sequelize: {
	  uri: 'mysql://',
	  username: process.env.OPENSHIFT_MYSQL_DB_USERNAME,
	  password: process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
	database: "taxon",
    options: {
      logging: console.log,
		
	dialect: "mysql", // or 'sqlite', 'postgres', 'mariadb'
	  host: process.env.OPENSHIFT_MYSQL_DB_HOST,
	  port: process.env.OPENSHIFT_MYSQL_DB_PORT,
	 // or 5432 (for postgres)
      define: {
        timestamps: false
      }
    }
  },
  */
};
