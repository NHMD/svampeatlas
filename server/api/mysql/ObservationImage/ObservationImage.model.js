'use strict';
var _ = require('lodash');
var validatePresenceOf = function(value) {
  return value && value.length;
};

module.exports = function(sequelize, DataTypes) {
  var ObservationImage = sequelize.define('ObservationImage', {

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
   hide: {
   	type: DataTypes.BOOLEAN,
   	allowNull: false,
   },
   name: {
   	type: DataTypes.STRING,
   	allowNull: false,
   }
   
  }, {
    	tableName: 'ObservationImages',
    	timestamps: false,
    	freezeTableName: true,
    	classMethods: {

    		associate: function(models) {
				
				models.ObservationImage.belongsTo(models.Observation, {
				  
				  foreignKey: '_id',
					as: 'Observation'
				});
				
		models.Observation
				.hasMany(models.ObservationImage, {
					foreignKey: "observation_id",
					as: "Images"
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

  return ObservationImage;
};
