'use strict';

module.exports = function(sequelize, DataTypes) {
	var ObservationArea = sequelize.define('ObservationArea', {
		observation_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references:     'Observation',
        referencesKey:  '_id'
		},
		area_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references:     'Area',
        referencesKey:  '_id'
		}
		/*,
	    'createdAt': {
	    	type: DataTypes.DATE,
	    	allowNull: false,
	    	defaultValue: DataTypes.NOW
	    } */
	}, {
		tableName: 'ObservationAreas',
		//	timestamps: false,
		freezeTableName: true,

	});

	return ObservationArea;
};
