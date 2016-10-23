'use strict';

module.exports = function(sequelize, DataTypes) {
	var VegetationType = sequelize.define('VegetationType', {
		_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		name_uk: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		tableName: 'VegetationType',
		//	timestamps: false,
		freezeTableName: true,

	});

	return VegetationType;
};
