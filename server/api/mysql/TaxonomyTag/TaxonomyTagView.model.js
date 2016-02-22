'use strict';

module.exports = function(sequelize, DataTypes) {
	var TaxonomyTagView = sequelize.define('TaxonomyTagView', {
		taxon_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		tag_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		tagname: {
			type: DataTypes.STRING,
			allowNull: false
		},
		tagowner: {
			type: DataTypes.INTEGER
		},
	}, {
		tableName: 'TaxonomyTagView',
		//	timestamps: false,
		freezeTableName: true,
    	classMethods: {
		
    		associate: function(models) {
		

			
    		}
		
  		},

	});

	return TaxonomyTagView;
};