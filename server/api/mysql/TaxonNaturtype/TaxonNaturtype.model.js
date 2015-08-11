'use strict';

module.exports = function(sequelize, DataTypes) {
	var TaxonNaturtype = sequelize.define('TaxonNaturtype', {
		naturtype_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references:     'Naturtype',
        referencesKey:  '_id'
		},
		taxon_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references:     'Taxon',
        referencesKey:  '_id'
		}
	}, {
		tableName: 'TaxonNaturtype',
		//	timestamps: false,
		freezeTableName: true,

	});

	return TaxonNaturtype;
};
