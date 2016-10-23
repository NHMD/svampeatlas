'use strict';

module.exports = function(sequelize, DataTypes) {
	var Naturtype = sequelize.define('Naturtype', {
		_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		tableName: 'Naturtyper',
		//	timestamps: false,
		freezeTableName: true,

	});

	return Naturtype;
};
