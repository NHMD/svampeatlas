'use strict';
var _ = require('lodash');
var validatePresenceOf = function(value) {
  return value && value.length;
};

module.exports = function(sequelize, DataTypes) {
  var MorphoGroup = sequelize.define('MorphoGroup', {

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
   name_dk: {
   	type: DataTypes.STRING,
   	allowNull: true,
   },

   
   name_uk: {
   	type: DataTypes.STRING,
   	allowNull: true,
   },
   image: {
   	type: DataTypes.STRING,
   	allowNull: true,
   },


  }, {
    	tableName: 'MorphoGroup',
    	timestamps: true,
    	freezeTableName: true,
    	classMethods: {

    		associate: function(models) {
				
				models.User.belongsToMany(models.MorphoGroup, {as: 'MorphoGroup', through: models.UserMorphoGroupImpact, foreignKey: 'user_id' });
				models.MorphoGroup.belongsToMany(models.User, {as : 'Users' , through: models.UserMorphoGroupImpact, foreignKey: 'morphogroup_id' });
	
				
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

  return MorphoGroup;
};
