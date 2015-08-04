'use strict';
var _ = require('lodash');
var validatePresenceOf = function(value) {
  return value && value.length;
};

module.exports = function(sequelize, DataTypes) {
  var Taxon = sequelize.define('Taxon', {

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
    Path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    SystematicPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Version: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    FullName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    GUID: {
		type: DataTypes.UUID,
		allowNull: true,
		defaultValue: DataTypes.UUIDV1
    },
    IsAccepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
		defaultValue: true
    },    
    FunIndexCurrUseNumber: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }, 
    FunIndexTypificationNumber: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }, 
    FunIndexNumber: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    RankID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    RankName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    TaxonName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Author: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    diagnose: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    beskrivelse: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    forvekslingsmuligheder: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    oekologi: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bemaerkning: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    foersteFundIDK: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
    },
    foersteReferenceForDK: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
    },
	PresentInDK: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    DK_reference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    MycoKeyIDDKWebLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    internalNote: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    DKnavn: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vernacular_name_DE: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vernacular_name_Fi: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vernacular_name_FR: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vernacular_name_GB: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vernacular_name_NL: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vernacular_name_NO: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vernacular_name_SE: {
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
    }

  }, {
    	tableName: 'Taxon',
    	timestamps: true,
    	freezeTableName: true,
    	classMethods: {
		
    		associate: function(models) {
		
    			models.Taxon
    				.belongsTo(models.Taxon, {
    					foreignKey: "parent_id",
    					as: "Parent"
    				});
			
    			models.Taxon
    				.hasMany(models.Taxon, {
    					foreignKey: "parent_id",
    					as: "children"
    				});
			
    		models.TaxonImages
    				.belongsTo(models.Taxon, {
    					foreignKey: "taxon_id",
    					as: "taxon"
    				});
					
    		models.Taxon
    				.hasMany(models.TaxonImages, {
    					foreignKey: "taxon_id",
    					as: "images"
    				});
			
    		models.Taxon
    				.hasMany(models.Taxon, {
    					foreignKey: "accepted_id",
    					as: "synonyms"
    				});
					
    		models.Taxon
    				.belongsTo(models.Taxon, {
    					foreignKey: "accepted_id",
    					as: "acceptedTaxon"
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

  return Taxon;
};
