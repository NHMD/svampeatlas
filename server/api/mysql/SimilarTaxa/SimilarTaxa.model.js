'use strict';

module.exports = function(sequelize, DataTypes) {
	var SimilarTaxa = sequelize.define('SimilarTaxa', {
		_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: DataTypes.NOW
		},
		createdbyuser_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		taxon1_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		taxon2_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		tableName: 'SimilarTaxa',
		//	timestamps: false,
		freezeTableName: true,
    	classMethods: {

    		associate: function(models) {
		
    			models.SimilarTaxa
    				.belongsTo(models.Taxon, {
    					foreignKey: "taxon1_id",
    					as: "Taxon1"
    				});
					
    			models.SimilarTaxa
    				.belongsTo(models.Taxon, {
    					foreignKey: "taxon2_id",
    					as: "Taxon2"
    				});
				
			models.SimilarTaxa
				.belongsTo(models.User, {
					foreignKey: "createdbyuser_id",
					as: "User"
				});
			}
			
			}

	});

	return SimilarTaxa;
};
