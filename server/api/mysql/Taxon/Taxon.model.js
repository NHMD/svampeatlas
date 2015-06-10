'use strict';

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
      type: DataTypes.STRING,
      allowNull: true,
    },
    IsAccepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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
    //	timestamps: false,
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
    			
		
    		}
		
  		},
      /**
       * Pre-save hooks
       */
      hooks: {
  		/*
        beforeBulkCreate: function(Taxons, fields, fn) {
          var totalUpdated = 0;
          Taxons.forEach(function(Taxon) {
            Taxon.updatePassword(function(err) {
              if (err) {
                return fn(err);
              }
              totalUpdated += 1;
              if (totalUpdated === Taxons.length) {
                return fn();
              }
            });
          });
        },
        beforeCreate: function(Taxon, fields, fn) {
          Taxon.updatePassword(fn);
        },
        beforeUpdate: function(Taxon, fields, fn) {
          if (Taxon.changed('password')) {
            Taxon.updatePassword(fn);
          }
        }
	  
  	  */
      },

      /**
       * Instance Methods
       */
      instanceMethods: {
  
      }

  
  });

  return Taxon;
};
