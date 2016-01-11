'use strict';
var _ = require('lodash');
var validatePresenceOf = function(value) {
  return value && value.length;
};

module.exports = function(sequelize, DataTypes) {
  var ObservationPoint = sequelize.define('ObservationPoint', {

    observation_id: {
   	type: DataTypes.INTEGER,
   	allowNull: false,
   	primaryKey: true,
   	autoIncrement: true
   },
   p: {
   	type: DataTypes.GEOMETRY('POINT'),
   	allowNull: true,
   }

  }, {
    	tableName: 'ObservationPoint',
    	
    	freezeTableName: true,
    	classMethods: {

    		associate: function(models) {
				
		models.Observation
				.hasOne(models.ObservationPoint, {
					foreignKey: "observation_id" ,
					as: "Point"
				});	
		models.ObservationPoint
				.belongsTo(models.Observation, {
					foreignKey: "observation_id" ,
					as: "Observation"
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

  return ObservationPoint;
};
