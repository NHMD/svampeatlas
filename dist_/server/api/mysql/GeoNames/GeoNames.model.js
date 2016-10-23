'use strict';
var _ = require('lodash');
var validatePresenceOf = function(value) {
  return value && value.length;
};

module.exports = function(sequelize, DataTypes) {
  var GeoNames = sequelize.define('GeoNames', {
	  
geonameId : {
   	type: DataTypes.INTEGER,
   	allowNull: false,
   	primaryKey: true
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
   name: {
   	type: DataTypes.STRING,
   	allowNull: false,
   },
   adminName1: {
   	type: DataTypes.STRING,
   	allowNull: false,
   },
   lat: {
   	type: DataTypes.DECIMAL(10,8),
   	allowNull: false,
   },
   lng: {
   	type: DataTypes.DECIMAL(11,8),
   	allowNull: false,
   },

countryName: {
   	type: DataTypes.STRING,
   	allowNull: false,
   },
countryCode: {
   	type: DataTypes.STRING,
   	allowNull: false,
   },
fcodeName: {
   	type: DataTypes.STRING,
   	allowNull: false,
   },
fclName: {
   	type: DataTypes.STRING,
   	allowNull: false,
   }
  }, {
    	tableName: 'GeoNames',
    	timestamps: true,
    	freezeTableName: true,
    	classMethods: {

    		associate: function(models) {
				
		
		
					
		models.Observation
				.belongsTo(models.GeoNames, {
					foreignKey: "geonameId" ,
					as: "GeoNames"
				});		
				
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

  return GeoNames;
};
