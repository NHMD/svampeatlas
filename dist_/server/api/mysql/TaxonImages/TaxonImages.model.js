'use strict';

module.exports = function(sequelize, DataTypes) {
	var TaxonImages = sequelize.define('TaxonImages', {
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
		thumburi: {
			type: DataTypes.STRING,
			allowNull: false
		},
		uri: {
			type: DataTypes.STRING,
			allowNull: false
		},
		photographer: DataTypes.STRING,
		country: DataTypes.STRING,
		collectionNumber: DataTypes.STRING
	}, {
		tableName: 'TaxonImages',
		//	timestamps: false,
		freezeTableName: true,

	});

	return TaxonImages;
};
