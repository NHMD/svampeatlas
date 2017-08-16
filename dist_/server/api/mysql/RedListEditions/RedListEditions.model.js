'use strict';


module.exports = function(sequelize, DataTypes) {
	var RedListEditions = sequelize.define('RedListEditions', {
		year: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		authors: DataTypes.STRING,

		notes: DataTypes.STRING
	}, {
		tableName: 'RedListEditions',
		//	timestamps: false,
		freezeTableName: true,

	});

	return RedListEditions;
};

