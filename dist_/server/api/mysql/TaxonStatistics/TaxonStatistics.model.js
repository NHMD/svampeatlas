'use strict';

module.exports = function(sequelize, DataTypes) {
	var TaxonStatistics = sequelize.define('TaxonStatistics', {

		taxon_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
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
		
		accepted_count: DataTypes.INTEGER,
		total_count: DataTypes.INTEGER,
		accepted_count_before_atlas: DataTypes.INTEGER,
		accepted_count_during_atlas: DataTypes.INTEGER,
		accepted_count_after_atlas: DataTypes.INTEGER,
		last_accepted_record: DataTypes.DATE,
		first_accepted_record: DataTypes.DATE
	}, {
		tableName: 'TaxonStatistics',
		//	timestamps: false,
		freezeTableName: true,

	});

	return TaxonStatistics;
};
