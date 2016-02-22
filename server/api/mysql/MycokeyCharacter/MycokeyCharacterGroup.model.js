'use strict';


module.exports = function(sequelize, DataTypes) {
	var MycokeyCharacterGroup = sequelize.define('MycokeyCharacterGroup', {
		
		CharacterGroupID: {
			type: DataTypes.INTEGER,
			allowNull: false,
      
      primaryKey: true
		},

		"Start description UK": {
			type: DataTypes.STRING,
			allowNull: false
		},
		"Start description DK": {
			type: DataTypes.STRING,
			allowNull: false
		},
		"Start text UK": {
			type: DataTypes.STRING,
			allowNull: false
		},
		"Start text DK": {
			type: DataTypes.STRING,
			allowNull: false
		},
		"Name": {
			type: DataTypes.STRING,
			allowNull: false
		},
		"Full text UK": {
			type: DataTypes.STRING,
			allowNull: false
		},
		"Full text DK": {
			type: DataTypes.STRING,
			allowNull: false
		},
		"Name": {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		tableName: 'CharacterGroup',
		timestamps: false,
		freezeTableName: true,
    	classMethods: {
		
    		associate: function(models) {
		
			models.MycokeyCharacterGroup
				.hasMany(models.MycokeyCharacter, {
					foreignKey: "CharacterID",
					as: "characters"
				});
		
		models.MycokeyCharacter
				.belongsTo(models.MycokeyCharacterGroup, {
					foreignKey: "CharacterGroup",
					as: "charactergroup"
				});


			
    		}
		
  		},

	});

	return MycokeyCharacterGroup;
};
