'use strict';
var _ = require('lodash');
var validatePresenceOf = function(value) {
  return value && value.length;
};

module.exports = function(sequelize, DataTypes) {
  var Area = sequelize.define('Area', {
	  
_id : {
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
   	allowNull: false,
   },
   verbatim_id: {
   	type: DataTypes.STRING,
   	allowNull: false,
   },
   geom: {
   	type: DataTypes.GEOMETRY('POLYGON'),
   	allowNull: true,
   }
  
  }, {
    	tableName: 'Areas',
    	timestamps: true,
    	freezeTableName: true,
    	classMethods: {

    		associate: function(models) {
				
		
		


					
				
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

  return Area;
};
