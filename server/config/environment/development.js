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
		password: "splendens",
	database: "svampeatlas",
    options: {
      logging: console.log,
		
	dialect: "mysql", // or 'sqlite', 'postgres', 'mariadb'
	port: 3306, // or 5432 (for postgres)
      define: {
        timestamps: false
      }
    }
  },

  seedDB: false
};
