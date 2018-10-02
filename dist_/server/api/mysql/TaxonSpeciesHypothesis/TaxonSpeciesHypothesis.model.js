'use strict';
var _ = require('lodash');


module.exports = function(sequelize, DataTypes) {
	var TaxonSpeciesHypothesis = sequelize.define('TaxonSpeciesHypothesis', {
		_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		taxon_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: 'Taxon',
			referencesKey: '_id'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		specieshypothesis: {
			type: DataTypes.STRING,
			allowNull: false,
		}

	}, {
		tableName: 'TaxonSpeciesHypothesis',
		timestamps: true,
		freezeTableName: true,

		/**
		 * Pre-save hooks
		 */
		hooks: {



		},

		/**
		 * Instance Methods
		 */
		instanceMethods: {

		}


	});

	return TaxonSpeciesHypothesis;
};
