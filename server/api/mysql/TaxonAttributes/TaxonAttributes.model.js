'use strict';
var _ = require('lodash');
var validatePresenceOf = function(value) {
  return value && value.length;
};

module.exports = function(sequelize, DataTypes) {
  var TaxonAttributes = sequelize.define('TaxonAttributes', {

    taxon_id: {
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
    }

  }, {
    	tableName: 'TaxonAttributes',
    	timestamps: true,
    	freezeTableName: true,

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

  return TaxonAttributes;
};