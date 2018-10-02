'use strict';

var validatePresenceOf = function(value) {
  return value && value.length;
};

module.exports = function(sequelize, DataTypes) {
  var DeterminationLog = sequelize.define('DeterminationLog', {

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

    logObject: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
	eventType: {
      type: DataTypes.STRING,
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
      allowNull: false,
    }

  }, {
    	tableName: 'DeterminationLog',
    	timestamps: true,
    	freezeTableName: true,
    	classMethods: {
		
    		associate: function(models) {
		

			
    			models.Determination
    				.hasMany(models.DeterminationLog, {
    					foreignKey: "_id",
    					as: "Determination"
    				});
    		models.DeterminationLog
    				.belongsTo(models.Determination, {
    					foreignKey: "determination_id",
    					as: "Determination"
    				});
    		
    		models.User
    				.hasMany(models.DeterminationLog, {
    					foreignKey: "_id"
    				});
    		models.DeterminationLog
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

  return DeterminationLog;
};
