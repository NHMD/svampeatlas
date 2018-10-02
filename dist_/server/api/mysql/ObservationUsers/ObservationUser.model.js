'use strict';

module.exports = function(sequelize, DataTypes) {
	var ObservationUser = sequelize.define('ObservationUser', {
		observation_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references:     'Observation',
        referencesKey:  '_id'
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references:     'User',
        referencesKey:  '_id'
		}
	}, {
		tableName: 'ObservationUsers',
		//	timestamps: false,
		freezeTableName: true,

	});

	return ObservationUser;
};
