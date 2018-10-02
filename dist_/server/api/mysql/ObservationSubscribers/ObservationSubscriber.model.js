'use strict';

module.exports = function(sequelize, DataTypes) {
	var ObservationSubscriber = sequelize.define('ObservationSubscriber', {
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
		},
	    createdAt: {
	      type: DataTypes.DATE,
	      allowNull: false,
	      defaultValue: DataTypes.NOW
	    },
	    updatedAt: {
	      type: DataTypes.DATE,
	      allowNull: false,
	      defaultValue: DataTypes.NOW
	    },
		
	}, {
		tableName: 'ObservationSubscriber',
			timestamps: false,
		freezeTableName: true,

	});

	return ObservationSubscriber;
};


