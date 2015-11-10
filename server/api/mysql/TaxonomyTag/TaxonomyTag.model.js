'use strict';

module.exports = function(sequelize, DataTypes) {
	var TaxonomyTag = sequelize.define('TaxonomyTag', {
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
		tagname: {
			type: DataTypes.STRING,
			allowNull: false
		},
		tagowner: {
			type: DataTypes.INTEGER
		},
	}, {
		tableName: 'TaxonTagDescriptions',
		//	timestamps: false,
		freezeTableName: true,
    	classMethods: {
		
    		associate: function(models) {
		
    		
    		models.User
    				.hasMany(models.TaxonomyTag, {
    					foreignKey: "_id"
    				});
    		models.TaxonomyTag
    				.belongsTo(models.User, {
    					foreignKey: "tagowner",
    					as: "User"
    				});

			
    		}
		
  		},

	});

	return TaxonomyTag;
};
