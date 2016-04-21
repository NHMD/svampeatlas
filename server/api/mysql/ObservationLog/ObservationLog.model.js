'use strict';

var validatePresenceOf = function(value) {
  return value && value.length;
};

module.exports = function(sequelize, DataTypes) {
  var ObservationLog = sequelize.define('ObservationLog', {

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
      allowNull: true
    },

    oldvalues: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    observation_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }

  }, {
    	tableName: 'ObservationLog',
    	timestamps: true,
    	freezeTableName: true,
    	classMethods: {
		
    		associate: function(models) {
		

			
    			models.Observation
    				.hasMany(models.ObservationLog, {
    					foreignKey: "_id",
    					as: "Observation"
    				});
    		models.ObservationLog
    				.belongsTo(models.Observation, {
    					foreignKey: "observation_id",
    					as: "Observation"
    				});
    		
    		models.User
    				.hasMany(models.ObservationLog, {
    					foreignKey: "_id"
    				});
    		models.ObservationLog
    				.belongsTo(models.User, {
    					foreignKey: "user_id",
    					as: "User"
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

  return ObservationLog;
};
