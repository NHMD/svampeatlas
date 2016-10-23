'use strict';

module.exports = function(sequelize, DataTypes) {
	var TaxonTag = sequelize.define('TaxonTag', {
		tag_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references:     'TaxonomyTags',
        referencesKey:  '_id'
		},
		taxon_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references:     'Taxon',
        referencesKey:  '_id'
		}
	}, {
		tableName: 'TaxonTags',
		//	timestamps: false,
		freezeTableName: true,

	});

	return TaxonTag;
};
