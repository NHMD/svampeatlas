'use strict';

var validatePresenceOf = function(value) {
  return value && value.length;
};

module.exports = function(sequelize, DataTypes) {
  var ObservationEvent = sequelize.define('ObservationEvent', {

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

	eventType: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    observation_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
	determination_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    }

  }, {
    	tableName: 'ObservationEvents',
    	timestamps: false,
    	freezeTableName: true,
    	classMethods: {
		
    		associate: function(models) {
		

			
    			models.Observation
    				.hasMany(models.ObservationEvent, {
    					foreignKey: "_id",
    					as: "Observation"
    				});
    		models.ObservationEvent
    				.belongsTo(models.Observation, {
    					foreignKey: "observation_id",
    					as: "Observation"
    				});
    		
    		models.User
    				.hasMany(models.ObservationEvent, {
    					foreignKey: "_id"
    				});
    		models.ObservationEvent
    				.belongsTo(models.User, {
    					foreignKey: "user_id",
    					as: "User"
    				});
				models.User.belongsToMany(models.ObservationEvent, {
					  through: models.ObservationEventMention,
					  foreignKey: 'user_id',
					as: "Mentions"
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

  return ObservationEvent;
};
