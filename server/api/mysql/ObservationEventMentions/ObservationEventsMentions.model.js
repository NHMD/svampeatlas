'use strict';

module.exports = function(sequelize, DataTypes) {
	var ObservationEventMention = sequelize.define('ObservationEventMention', {
		observationevent_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references:     'ObservationEvent',
        referencesKey:  '_id'
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references:     'User',
        referencesKey:  '_id'
		}
	}, {
		tableName: 'ObservationEventMentions',
		//	timestamps: false,
		freezeTableName: true,

	});

	return ObservationEventMention;
};
