'use strict';
var _ = require('lodash');
var validatePresenceOf = function(value) {
  return value && value.length;
};

module.exports = function(sequelize, DataTypes) {
  var Observation = sequelize.define('Observation', {

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
   observationDate: {
   	type: DataTypes.DATEONLY,
   	allowNull: false
   },
   observationDateAccuracy: {
   	type: DataTypes.ENUM('day', 'month', 'year', 'invalid'),
   	allowNull: false,
   	defaultValue: 'day'
   },
   locality_id: {
   	type: DataTypes.INTEGER,
   	allowNull: true,
   },
   verbatimLocality: {
   	type: DataTypes.STRING,
   	allowNull: true,
   },
   primaryuser_id: {
   	type: DataTypes.INTEGER,
   	allowNull: true,
   },
   verbatimLeg: {
   	type: DataTypes.STRING,
   	allowNull: true,
   },
   primarydetermination_id: {
   	type: DataTypes.INTEGER,
   	allowNull: true,
   },
   primaryassociatedorganism_id: {
   	type: DataTypes.INTEGER,
   	allowNull: true,
   },
   vegetationtype_id: {
   	type: DataTypes.INTEGER,
   	allowNull: true,
   },
   substrate_id: {
   	type: DataTypes.INTEGER,
   	allowNull: true,
   },
   ecologynote: {
   	type: DataTypes.TEXT,
   	allowNull: true,
   },
   decimalLatitude: {
   	type: DataTypes.DOUBLE,
   	allowNull: false,
   },
   decimalLongitude: {
   	type: DataTypes.DOUBLE,
   	allowNull: false,
   },
   accuracy: {
   	type: DataTypes.INTEGER,
   	allowNull: true,
   },
   atlasUUID: {
   	type: DataTypes.UUID,
   	allowNull: true,
   	defaultValue: DataTypes.UUIDV1
   },
   fieldnumber: {
   	type: DataTypes.STRING,
   	allowNull: true,
   },
   herbarium: {
   	type: DataTypes.STRING,
   	allowNull: true,
   },
   note: {
   	type: DataTypes.TEXT,
   	allowNull: true,
   },
   noteInternal: {
   	type: DataTypes.TEXT,
   	allowNull: true,
   },
   dataSource: {
   	type: DataTypes.STRING,
   	allowNull: true,
   },
   geom: {
   	type: DataTypes.GEOMETRY('POINT'),
   	allowNull: true,
   }

  }, {
    	tableName: 'Observation',
    	timestamps: true,
    	freezeTableName: true,
    	classMethods: {

    		associate: function(models) {
				
		models.Observation
				.hasOne(models.Determination, {
					foreignKey: "observation_id" ,
					as: "PrimaryDetermination"
				});	
		models.Observation
				.belongsTo(models.User, {
					foreignKey: "primaryuser_id" ,
					as: "PrimaryUser"
				});	
				
		models.Observation
				.belongsTo(models.Substrate, {
					foreignKey: "substrate_id" ,
					as: "Substrate"
				});	
		models.Observation
				.belongsTo(models.VegetationType, {
					foreignKey: "vegetationtype_id" ,
					as: "VegetationType"
				});	
				models.Observation.belongsToMany(models.User, {
				  through: models.ObservationUser,
				  foreignKey: 'observation_id',
				as: 'users'
				});
				
				models.Observation.hasMany(models.ObservationUser, {
				 
				  foreignKey: 'observation_id',
				as: 'userIds'
				});
				
				models.User.belongsToMany(models.Observation, {
				  through: models.ObservationUser,
				  foreignKey: 'user_id'
				});				
			/*	
				models.Taxon.belongsToMany(models.Naturtype, {
				  through: models.TaxonNaturtype,
				  foreignKey: 'taxon_id',
				as: 'naturtyper'
				});
				models.Naturtype.belongsToMany(models.Taxon, {
				  through: models.TaxonNaturtype,
				  foreignKey: 'naturtype_id'
				});		
		
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

  return Observation;
};
