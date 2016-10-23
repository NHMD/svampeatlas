'use strict';


module.exports = function(sequelize, DataTypes) {
  var Userroles = sequelize.define('Userroles', {

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
			references: "User",
			referencesKey: "_id"
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
			references: "Role",
			referencesKey: "_id"
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }

  }, {
    	tableName: 'Userroles',
    //	timestamps: false,
    	freezeTableName: true,
    	classMethods: {
		
		
  		},
      /**
       * Pre-save hooks
       */
      hooks: {

      },

      /**
       * Instance Methods
       */
      instanceMethods: {
  
      }

  
  });

  return Userroles;
};
