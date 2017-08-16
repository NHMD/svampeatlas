'use strict';

var validatePresenceOf = function(value) {
  return value && value.length;
};

module.exports = function(sequelize, DataTypes) {
  var TaxonLog = sequelize.define('TaxonLog', {

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
    eventname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    taxon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }

  }, {
    	tableName: 'TaxonLog',
    	timestamps: true,
    	freezeTableName: true,
    	classMethods: {
		
    		associate: function(models) {
		

			
    			models.Taxon
    				.hasMany(models.TaxonLog, {
    					foreignKey: "_id",
    					as: "Taxon"
    				});
    		models.TaxonLog
    				.belongsTo(models.Taxon, {
    					foreignKey: "taxon_id",
    					as: "Taxon"
    				});
    		
    		models.User
    				.hasMany(models.TaxonLog, {
    					foreignKey: "_id"
    				});
    		models.TaxonLog
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

  return TaxonLog;
};
