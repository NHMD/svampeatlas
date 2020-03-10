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
		defaultValue: false
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
    spiselighedsrapport: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    BeskrivelseUK: {
      type: DataTypes.STRING,
      allowNull: true,
    },
	bogtekst_faenologi_udbredelse: {
      type: DataTypes.STRING,
      allowNull: true,
	},
	bogtekst_gyldendal: {
      type: DataTypes.STRING,
      allowNull: true,
	},
	bogtekst_gyldendal_en: {
      type: DataTypes.STRING,
      allowNull: true,
	},
	bog_Gyldendal_art_medtages: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
		defaultValue: false
	},
	Bogtekst_stor_art: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
		defaultValue: false
	},
	bog_gyldendal_korrekturlaest: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
		defaultValue: false
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
    valideringskrav: {
      type: DataTypes.INTEGER(2),
      allowNull: false,
		defaultValue: 2
    },
    valideringsrapport: {
      type: DataTypes.STRING,
      allowNull: true
		
    },
    basionym_described: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
    },
    fn_temperate: {
      type: DataTypes.STRING,
      allowNull: true
		
    },
    fn_hemiboreal: {
      type: DataTypes.STRING,
      allowNull: true
		
    },
    fn_boreal: {
      type: DataTypes.STRING,
      allowNull: true
		
    },
    fn_subarctic_alpine: {
      type: DataTypes.STRING,
      allowNull: true
		
    },
    fn_arctic_alpine: {
      type: DataTypes.STRING,
      allowNull: true
		
    },
    fn_comment: {
      type: DataTypes.STRING,
      allowNull: true
		
    },
    North_of_DK: {
      type: DataTypes.STRING,
      allowNull: true
		
    },
    South_of_DK: {
      type: DataTypes.STRING,
      allowNull: true
		
    },
    West_of_DK: {
      type: DataTypes.STRING,
      allowNull: true
		
    },
    East_of_DK: {
      type: DataTypes.STRING,
      allowNull: true
		
    },
	atlasart: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
		defaultValue: false
	},

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
