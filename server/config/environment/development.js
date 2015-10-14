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
  
  plutof : {
  	client_id: 'fJ43ypTmHBhsNjr6NoxqJ3MN7FbSmnD3anNp5Q16',
	  client_secret:   'sukZIxGIgusbE67TkURKmjvHcixd5l1uEqdXlZ9kWEHD7WIV0xmnH01BtOrHXmYQGQk63Tdxd2xOVXQeP00rXb7ZM0c5yfagm97vLoPZEqROeTDg8li8waSNc8tb2cR8',
	  grant_type: 'password',
	  username: 'svampeatlas',
	  password: 'selandicus031003',
	  scope: 'read'
  },

  seedDB: false
};
