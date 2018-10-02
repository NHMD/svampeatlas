'use strict';


module.exports = function(sequelize, DataTypes) {
	var MycokeyCharacterGroupView = sequelize.define('MycokeyCharacterGroupView', {

		CharacterID: {
			type: DataTypes.INTEGER,
			allowNull: false,
      
      primaryKey: true
		},
		"Type": {
			type: DataTypes.STRING,
			allowNull: false
		},
		"Unit": {
			type: DataTypes.STRING,
			allowNull: false
		},

		"description UK": {
			type: DataTypes.STRING,
			allowNull: false
		},
		"description DK": {
			type: DataTypes.STRING,
			allowNull: false
		},
		"Short text UK": {
			type: DataTypes.STRING,
			allowNull: false
		},
		"Short text DK": {
			type: DataTypes.STRING,
			allowNull: false
		},
		"Group Full text UK": {
			type: DataTypes.STRING,
			allowNull: false
		},
		"Group Full text DK": {
			type: DataTypes.STRING,
			allowNull: false
		},
		"Name": {
			type: DataTypes.STRING,
			allowNull: false
		},
		CharacterGroup: {
			type: DataTypes.INTEGER
		},
	}, {
		tableName: 'CharacterView2',
		timestamps: false,
		freezeTableName: true,
    	classMethods: {
		
    		associate: function(models) {
		
    		


			
    		}
		
  		},

	});

	return MycokeyCharacterGroupView;
};
