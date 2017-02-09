'use strict';


module.exports = function(sequelize, DataTypes) {
  var UserMorphoGroupImpact = sequelize.define('UserMorphoGroupImpact', {

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
			references: "User",
			referencesKey: "_id"
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
    },
    base_impact: {
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
