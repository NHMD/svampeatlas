'use strict';

module.exports = function(sequelize, DataTypes) {
	var TaxonDKnames = sequelize.define('TaxonDKnames', {
		_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		taxon_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: DataTypes.NOW
		},
		vernacularname_dk: {
			type: DataTypes.STRING,
			allowNull: false
		},
		appliedLatinName: DataTypes.STRING,
		source: DataTypes.STRING
	}, {
		tableName: 'TaxonDKnames',
		//	timestamps: false,
		freezeTableName: true,

	});

	return TaxonDKnames;
};
