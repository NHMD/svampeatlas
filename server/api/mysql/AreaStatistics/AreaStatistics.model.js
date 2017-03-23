'use strict';

module.exports = function(sequelize, DataTypes) {
	var AreaStatistics = sequelize.define('AreaStatistics', {

		area_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW
		},
		
		
		num_users: DataTypes.INTEGER,
		num_obs: DataTypes.INTEGER,
		num_days: DataTypes.INTEGER,
		num_years: DataTypes.INTEGER,
		num_species: DataTypes.INTEGER
	}, {
		tableName: 'AreaStatistics',
			timestamps: false,
		freezeTableName: true,

	});

	return AreaStatistics;
};
