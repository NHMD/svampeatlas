'use strict';
var _ = require('lodash');
var validatePresenceOf = function(value) {
  return value && value.length;
};

module.exports = function(sequelize, DataTypes) {
  var ObservationForum = sequelize.define('ObservationForum', {

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
   observation_id: {
   	type: DataTypes.INTEGER,
   	allowNull: false,
   },
   user_id: {
   	type:  DataTypes.INTEGER,
   	allowNull: false,
   },
   content: {
   	type: DataTypes.TEXT,
   	allowNull: false,
   }
   
  }, {
    	tableName: 'ObservationForum',
    	timestamps: false,
    	freezeTableName: true,
    	classMethods: {

    		associate: function(models) {
				
				models.ObservationForum.belongsTo(models.Observation, {
				  
				  foreignKey: '_id',
					as: 'Observation'
				});
				
		models.Observation
				.hasMany(models.ObservationForum, {
					foreignKey: "observation_id",
					as: "Forum"
				});	
				

		models.ObservationForum.belongsTo(models.User, {
				  
				  foreignKey: 'user_id',
					as: 'User'
				});			
				
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

  return ObservationForum;
};
