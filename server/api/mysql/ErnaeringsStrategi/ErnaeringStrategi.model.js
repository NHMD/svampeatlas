'use strict';

module.exports = function(sequelize, DataTypes) {
	var ErnaeringsStrategi = sequelize.define('ErnaeringsStrategi', {
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
		tableName: 'ErnaeringStrategi',
		//	timestamps: false,
		freezeTableName: true,

	});

	return ErnaeringsStrategi;
};
