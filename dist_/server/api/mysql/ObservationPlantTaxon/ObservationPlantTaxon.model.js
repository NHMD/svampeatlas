'use strict';

module.exports = function(sequelize, DataTypes) {
	var ObservationPlantTaxon = sequelize.define('ObservationPlantTaxon', {
		observation_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references:     'Observation',
        referencesKey:  '_id'
		},
		planttaxon_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references:     'PlantTaxon',
        referencesKey:  '_id'
		}
	}, {
		tableName: 'ObservationPlantTaxon',
		//	timestamps: false,
		freezeTableName: true,

	});

	return ObservationPlantTaxon;
};
