'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8080,

  // MongoDB connection options
  mongo: {
    uri:    process.env.MONGOLAB_URI ||
            process.env.MONGOHQ_URL ||
            process.env.OPENSHIFT_MONGODB_DB_URL +
            process.env.OPENSHIFT_APP_NAME ||
            'mongodb://localhost/app'
  },
,
  sequelize: {
	  uri: 'mysql://',
	  username: process.env.OPENSHIFT_MYSQL_DB_USERNAME,
	  password: process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
	database: "taxonbase",
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
};
