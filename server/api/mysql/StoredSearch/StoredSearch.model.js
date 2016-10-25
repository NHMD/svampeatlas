'use strict';
var _ = require('lodash');
var validatePresenceOf = function(value) {
  return value && value.length;
};

module.exports = function(sequelize, DataTypes) {
  var Storedsearch = sequelize.define('Storedsearch', {

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

   user_id: {
   	type: DataTypes.INTEGER,
   	allowNull: false,
	   references: {
	         model: "User",
	         key: "_id"
	       }
   },
  
   search: {
   	type: DataTypes.TEXT,
   	allowNull: true,
   },
   
   name: {
   	type: DataTypes.STRING,
   	allowNull: true,
   }
  }, {
    	tableName: 'Storedsearch',
    	timestamps: true,
    	freezeTableName: true,
    	classMethods: {

    		associate: function(models) {
				
		
		
	
		models.Storedsearch
				.belongsTo(models.User, {
					foreignKey: "user_id" ,
					as: "User"
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

  return Storedsearch;
};
