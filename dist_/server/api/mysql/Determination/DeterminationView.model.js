'use strict';
var _ = require('lodash');
var validatePresenceOf = function(value) {
  return value && value.length;
};

module.exports = function(sequelize, DataTypes) {
  var DeterminationView = sequelize.define('DeterminationView', {
      Determination_id: {
     	type: DataTypes.INTEGER,
     	
   	allowNull: false,
   	primaryKey: true,
   	autoIncrement: true
     },
     Determination_createdAt: {
     	type: DataTypes.DATE,
     	allowNull: false,
     	defaultValue: DataTypes.NOW
     },
     Determination_updatedAt: {
     	type: DataTypes.DATE,
     	allowNull: true,
     },
     Determination_observation_id: {
     	type: DataTypes.INTEGER,
     	allowNull: false,
     },
     Determination_taxon_id: {
     	type: DataTypes.INTEGER,
     	allowNull: false,
     },
     Determination_user_id: {
     	type: DataTypes.INTEGER,
     	allowNull: true,
     },
     Determination_confidence: {
     	type: DataTypes.ENUM('sikker','sandsynlig','mulig'),
     	allowNull: true
     },
     Determination_score: {
     	type: DataTypes.INTEGER,
     	allowNull: false,
      defaultValue: 0   
     },
     Determination_validation: {
     	type: DataTypes.ENUM('Godkendt','Gammelvali','Valideres','Afventer','Afvist','Slettes'),
     	allowNull: true
     },
     Determination_notes: {
     	type: DataTypes.TEXT,
     	allowNull: true,
     },
  
     Determination_validatorremarks: {
     	type: DataTypes.STRING,
     	allowNull: true,
     },
     Determination_validator_id: {
     	type: DataTypes.INTEGER,
     	allowNull: true,
     },
  
     Determination_verbatimdeterminator: {
     	type: DataTypes.STRING,
     	allowNull: true
     },
     // tax
      Taxon_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
		  references: {
		        model: "MycokeyCharacterView",
		        key: "taxon_id"
		      }
      },
      Taxon_createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      Taxon_updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      Taxon_Path: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Taxon_SystematicPath: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Taxon_Version: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      Taxon_FullName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Taxon_GUID: {
   	type: DataTypes.UUID,
   	allowNull: true,
   	defaultValue: DataTypes.UUIDV1
      },    
      Taxon_FunIndexCurrUseNumber: {
        type: DataTypes.INTEGER(11),
   	allowNull: true,
      defaultValue: null,
      }, 
      Taxon_FunIndexTypificationNumber: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      }, 
      Taxon_FunIndexNumber: {
        type: DataTypes.INTEGER(11),
   allowNull: true,
      defaultValue: null,
      },
      Taxon_RankID: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      Taxon_RankName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Taxon_TaxonName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Taxon_Author: {
        type: DataTypes.STRING,
        allowNull: true,
      },
   Taxon_vernacularname_dk :{
        type: DataTypes.STRING,
        allowNull: true,
      },
	  Recorded_as_FullName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
	  Recorded_as_id: {
        type: DataTypes.INTEGER(11),
   	allowNull: true
      },
	  
	  Taxon_redlist_status :{
        type: DataTypes.STRING,
        allowNull: true,
      },
	  
	  Taxon_morphogroup_id:  {
        type: DataTypes.INTEGER(11),
   	allowNull: true
      },
	  
	  mycorrhizal: {
	  	type: DataTypes.BOOLEAN
	  },
	  lichenized: {
	  	type: DataTypes.BOOLEAN
	  },

 parasite: {
	  	type: DataTypes.BOOLEAN
	  },
  saprobe: {
	  	type: DataTypes.BOOLEAN
	  },
  on_lichens: {
	  	type: DataTypes.BOOLEAN
	  },
  on_wood: {
	  	type: DataTypes.BOOLEAN
	  }
   
  }, {
    	tableName: 'DeterminationView2',
    	timestamps: false,
    	freezeTableName: true,
    	classMethods: {

    		associate: function(models) {
				
		
		
		models.Observation
				.belongsTo(models.DeterminationView, {
					foreignKey: "primarydetermination_id" ,
					as: "DeterminationView"
				});	
				
		models.DeterminationView
				.belongsTo(models.TaxonAttributes, {
					foreignKey: "Taxon_id" ,
					as: "attributes"
				});	
	
		models.DeterminationView
				.belongsTo(models.User, {
					foreignKey: "Determination_user_id" ,
					as: "Determiner"
				});		

			//	models.MycokeyCharacterView.belongsToMany(models.DeterminationView, { foreignKey: 'Taxon_id',  constraints: false});
					
    		
				
	/*
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
					for(var i=0; i< 25; i++){
						models.Taxon.belongsToMany(models.TaxonomyTag, {
						  through: models.TaxonTag,
						  foreignKey: 'taxon_id',
						as: 'tags'+i
						});
						models.TaxonomyTag.belongsToMany(models.Taxon, {
						  through: models.TaxonTag,
						  foreignKey: 'tag_id',
							as: 'tags'+i
						});
					}
				
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

  return DeterminationView;
};
