'use strict';

module.exports = function(sequelize, DataTypes) {
	var Substrate = sequelize.define('Substrate', {
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
		},
		group_dk: {
			type: DataTypes.STRING,
			allowNull: false
		},
		group_uk: {
			type: DataTypes.STRING,
			allowNull: false
		},
		hide: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
	}, {
		tableName: 'Substrate',
		//	timestamps: false,
		freezeTableName: true,

	});

	return Substrate;
};
