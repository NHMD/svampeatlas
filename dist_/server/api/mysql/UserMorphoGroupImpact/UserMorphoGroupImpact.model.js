'use strict';


module.exports = function(sequelize, DataTypes) {
  var UserMorphoGroupImpact = sequelize.define('UserMorphoGroupImpact', {
      _id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
			references: "User",
			referencesKey: "_id"
    },
    updatedByUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
			references: "User",
			referencesKey: "_id"
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
    morphogroup_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
			references: "MorphoGroup",
			referencesKey: "_id"
    },
    impact: {
      type: DataTypes.INTEGER,
      allowNull: false,
		defaultValue: 1
    },
    min_impact: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    max_impact: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  

  }, {
    	tableName: 'UserMorphoGroupImpact',
    //	timestamps: false,
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

  return UserMorphoGroupImpact;
};
