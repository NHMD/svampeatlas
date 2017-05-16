'use strict';


module.exports = function(sequelize, DataTypes) {
	var MycokeyCharacterView = sequelize.define('MycokeyCharacterView', {
		taxon_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
  		  references: {
  		        model: "DeterminationView",
  		        key: "Taxon_id"
  		      }
		},
		CharacterID: {
			type: DataTypes.INTEGER,
			allowNull: false,
      
      primaryKey: true
		},

		"description UK": {
			type: DataTypes.STRING,
			allowNull: false
		},
		"description DK": {
			type: DataTypes.STRING,
			allowNull: false
		},
		"Short text UK": {
			type: DataTypes.STRING,
			allowNull: false
		},
		"Short text DK": {
			type: DataTypes.STRING,
			allowNull: false
		},

		"Name": {
			type: DataTypes.STRING,
			allowNull: false
		},
		CharacterGroup: {
			type: DataTypes.INTEGER
		},
		'RealValueMax': {
			type: DataTypes.INTEGER,
			defaultValue: 0
		},
		'RealValueMin': {
			type: DataTypes.INTEGER,
			defaultValue: 0
		},
		"Type": {
			type: DataTypes.STRING,
			allowNull: false
		},
		"Unit": {
			type: DataTypes.STRING,
			allowNull: false
		},
	}, {
		tableName: 'CharacterView',
		timestamps: false,
		freezeTableName: true,
    	classMethods: {
		
    		associate: function(models) {
		
    		


			
    		}
		
  		},

	});

	return MycokeyCharacterView;
};
