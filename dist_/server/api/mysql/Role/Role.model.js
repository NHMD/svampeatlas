'use strict';

var validatePresenceOf = function(value) {
  return value && value.length;
};

module.exports = function(sequelize, DataTypes) {
  var Role = sequelize.define('Role', {

    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    }

  }, {
    	tableName: 'Role',
    //	timestamps: false,
    	freezeTableName: true,
    	classMethods: {
		
    		associate: function(models) {
		
					
					
				models.User.belongsToMany(models.Role, { through: models.Userroles, foreignKey: 'user_id' });
				models.Role.belongsToMany(models.User, {as : 'Roles' , through: models.Userroles, foreignKey: 'role_id' });

    			
		
    		}
		
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

  return Role;
};
