'use strict';
var _ = require('lodash');


module.exports = function(sequelize, DataTypes) {
  var DnaSequence = sequelize.define('DnaSequence', {

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
   sequence: {
   	type: DataTypes.TEXT,
   	allowNull: false,
   },
   marker: {
   	type: DataTypes.STRING,
   	allowNull: false,
   },
   geneticAccessionNumber: {
   	type: DataTypes.STRING,
   	allowNull: true,
   }
   
  }, {
    	tableName: 'DnaSequence',
    	timestamps: false,
    	freezeTableName: true,
    	classMethods: {

    		associate: function(models) {
				
				models.DnaSequence.belongsTo(models.Observation, {
				  
				  foreignKey: '_id',
					as: 'Observation'
				});
				
		models.Observation
				.hasMany(models.DnaSequence, {
					foreignKey: "observation_id",
					as: "DnaSequence"
				});	
				

		models.DnaSequence.belongsTo(models.User, {
				  
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

  return DnaSequence;
};
