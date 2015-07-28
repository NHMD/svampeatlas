'use strict';

module.exports = function(sequelize, DataTypes) {
	var TaxonImages = sequelize.define('TaxonRanks', {
		_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},

		RankName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		RankID: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
	}, {
		tableName: 'TaxonRanks',
		//	timestamps: false,
		freezeTableName: true,

	});

	return TaxonImages;
};
