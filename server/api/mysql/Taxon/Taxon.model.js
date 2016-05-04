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
    FunIndexCurrUseNumber: {
      type: DataTypes.INTEGER(11),
		allowNull: true,
    defaultValue: null,
    }, 
    FunIndexTypificationNumber: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }, 
    FunIndexNumber: {
      type: DataTypes.INTEGER(11),
 allowNull: true,
    defaultValue: null,
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
	vernacularname_dk_id :{
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
	/*
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
	*/
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
					models.TaxonSpeciesHypothesis.belongsTo(models.Taxon, {
					  
					  foreignKey: 'taxon_id',
						as: 'taxon'
					});
			models.Taxon
    				.hasMany(models.TaxonSpeciesHypothesis, {
    					foreignKey: "taxon_id",
    					as: "specieshypothesis"
    				});			
    		models.Taxon
    				.hasMany(models.TaxonImages, {
    					foreignKey: "taxon_id",
    					as: "images"
    				});
			models.Taxon
					.belongsTo(models.TaxonDKnames, {
						foreignKey: "vernacularname_dk_id" ,
						as: "Vernacularname_DK",
						constraints: false
					});	
			models.TaxonDKnames
					.belongsTo(models.Taxon, {
						foreignKey: "taxon_id" ,
						as: "taxon",
						constraints: false
					});
    		models.Taxon
    				.hasMany(models.TaxonDKnames, {
    					foreignKey: "taxon_id",
    					as: "DanishNames"
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
					models.TaxonRedListData.belongsTo(models.Taxon, {
					  
					  foreignKey: '_id',
						as: 'taxon'
					});
					
			models.Taxon
    				.hasMany(models.TaxonRedListData, {
    					foreignKey: "taxon_id",
    					as: "redlistdata"
    				});	
			
					
    		models.Taxon
    				.hasOne(models.TaxonAttributes, {
    					foreignKey: "taxon_id" ,
    					as: "attributes"
    				});
    		
			
					models.Taxon.belongsToMany(models.Naturtype, {
					  through: models.TaxonNaturtype,
					  foreignKey: 'taxon_id',
					as: 'naturtyper'
					});
					models.Naturtype.belongsToMany(models.Taxon, {
					  through: models.TaxonNaturtype,
					  foreignKey: 'naturtype_id'
					});
			
			
					models.Taxon.belongsToMany(models.ErnaeringsStrategi, {
					  through: models.TaxonErnaeringsStrategi,
					  foreignKey: 'taxon_id',
					as: 'nutritionstrategies'
					});
					models.ErnaeringsStrategi.belongsToMany(models.Taxon, {
					  through: models.TaxonErnaeringsStrategi,
					  foreignKey: 'ernaeringsstrategi_id'
					});
					
					models.Taxon.belongsToMany(models.TaxonomyTag, {
					  through: models.TaxonTag,
					  foreignKey: 'taxon_id',
					as: 'tags'
					});
					models.TaxonomyTag.belongsToMany(models.Taxon, {
					  through: models.TaxonTag,
					  foreignKey: 'tag_id',
						as: 'tags'
					});
					
					// this is a Hack !  It seems to be impossible to build inner joins dynamically with sequelize. Therefore 25 associations are build to be able to query multiple tags at once
					//  also note that since sequelize currently (v 3.19) doesnet do limit on many-to-many correctly, we have created views on tags and morphotags to mimic one-to-many
					
					for(var i=0; i< 25; i++){
					
						models.Taxon.hasMany(models.TaxonomyTagView, {
						 // through: models.TaxonTag,
						  foreignKey: 'taxon_id',
						as: 'tags'+i
						});
						/*
						models.TaxonomyTag.belongsToMany(models.Taxon, {
						  through: models.TaxonTag,
						  foreignKey: 'tag_id',
							as: 'tags'+i
						});
						*/
						
					};
					
					// this is a Hack !  It seems to be impossible to build inner joins dynamically with sequelize. Therefore 25 associations are build to be able to query multiple tags at once
					for(var i=0; i< 25; i++){
						models.Taxon.hasMany(models.MycokeyCharacterView, {
						//  through: models.MycokeyGenusCharacter,
						  foreignKey: 'taxon_id',
						as: 'character'+i
						});
						/*
						models.MycokeyCharacter.belongsToMany(models.Taxon, {
						  through: models.MycokeyGenusCharacter,
						  foreignKey: 'Character',
							as: 'taxon'+i
						});
						*/
					}
					
					/*
					models.Taxon.belongsToMany(models.MycoKeyCharacter, {
					  through: models.MycokeyGenusCharacter,
					  foreignKey: 'taxon_id',
					as: 'MycoKeyCharacters'
					});
					models.MycoKeyCharacter.belongsToMany(models.Taxon, {
					  through: models.MycokeyGenusCharacter,
					  foreignKey: 'Character',
						as: 'MycoKeyCharacters'
					});
				
				*/
					
				
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
