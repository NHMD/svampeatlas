'use strict';

module.exports = function(sequelize, DataTypes) {
	var MycokeyGenusCharacter = sequelize.define('MycokeyGenusCharacter', {
		"Character": {
			type: DataTypes.INTEGER,
			allowNull: false,
			references:     'MycokeyCharacter',
        referencesKey:  'CharacterID'
		},
		taxon_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references:     'Taxon',
        referencesKey:  '_id'
		},
		'GenusID': {
			type: DataTypes.INTEGER,
			defaultValue: 0
		},
		'xxxx': {
			type: DataTypes.INTEGER,
			defaultValue: 1
		},
		'BoolValue': {
			type: DataTypes.INTEGER,
			defaultValue: 1
		}, 
		'Probability': {
			type: DataTypes.INTEGER,
			defaultValue: 100
		}, 
		'mark': {
			type: DataTypes.INTEGER,
			defaultValue: 0
		},
		'CodedForSpecies': {
			type: DataTypes.INTEGER,
			defaultValue: 0
		}, 
		'check': {
			type: DataTypes.INTEGER,
			defaultValue: 0
		},
		'RealValueMax': {
			type: DataTypes.INTEGER,
			defaultValue: 0
		},
		'RealValueMin': {
			type: DataTypes.INTEGER,
			defaultValue: 0
		}
	}, {
		tableName: 'GenusCharacters',
			timestamps: false,
		freezeTableName: true,

	});

	return MycokeyGenusCharacter;
};