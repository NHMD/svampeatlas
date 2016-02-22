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
		}
	}, {
		tableName: 'GenusCharacters',
			timestamps: false,
		freezeTableName: true,

	});

	return MycokeyGenusCharacter;
};