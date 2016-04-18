'use strict';
var _ = require('lodash');


module.exports = function(sequelize, DataTypes) {
  var PlantTaxon = sequelize.define('PlantTaxon', {

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
      allowNull: true,
    },
    DKname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    DKandLatinName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Ectomycorrhizal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Genus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    LatinName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    LatinCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    WoodySubstrate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    parent_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    accepted_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    gbiftaxon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    defaultlist: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    }

  }, {
    	tableName: 'PlantTaxon',
    	timestamps: true,
    	freezeTableName: true,
    	classMethods: {

    		associate: function(models) {
		
		models.PlantTaxon
				.hasMany(models.PlantTaxon, {
					foreignKey: "accepted_id",
					as: "synonyms"
				});
				
		models.PlantTaxon
				.belongsTo(models.PlantTaxon, {
					foreignKey: "accepted_id",
					as: "acceptedTaxon"
		
				});
				
				models.Observation.belongsToMany(models.PlantTaxon, {
				  through: models.ObservationPlantTaxon,
				  foreignKey: 'observation_id',
				as: 'associatedTaxa'
				});
				models.PlantTaxon.belongsToMany(models.Observation, {
				  through: models.ObservationPlantTaxon,
				  foreignKey: 'planttaxon_id'
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

  return PlantTaxon;
};
