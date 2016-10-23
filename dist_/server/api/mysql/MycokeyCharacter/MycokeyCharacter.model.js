'use strict';


module.exports = function(sequelize, DataTypes) {
	var MycokeyCharacter = sequelize.define('MycokeyCharacter', {
		
		CharacterID: {
			type: DataTypes.INTEGER,
			allowNull: false,
      
      primaryKey: true
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
		"Name": {
			type: DataTypes.STRING,
			allowNull: false
		},
		CharacterGroup: {
			type: DataTypes.INTEGER
		},
	}, {
		tableName: 'Characters',
		timestamps: false,
		freezeTableName: true,
    	classMethods: {
		
    		associate: function(models) {
		
    		


			
    		}
		
  		},

	});

	return MycokeyCharacter;
};
