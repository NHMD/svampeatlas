'use strict';

module.exports = function(sequelize, DataTypes) {
	var TaxonErnaeringsStrategi = sequelize.define('TaxonErnaeringsStrategi', {
		ernaeringsstrategi_id: {
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
		tableName: 'TaxonErnaeringStrategi',
		//	timestamps: false,
		freezeTableName: true,

	});

	return TaxonErnaeringsStrategi;
};
