'use strict';

module.exports = function(sequelize, DataTypes) {
	var DeterminationVote = sequelize.define('DeterminationVote', {
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
	      allowNull: true
	    },
		observation_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references:     'Observation',
        referencesKey:  '_id'
		},
		determination_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references:     'Determination',
        referencesKey:  '_id'
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references:     'Users',
        referencesKey:  '_id'
		},
		score: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		isDownVote: {
		    type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN, ['score']),
		    get: function() {
		      return this.get('score') < 0
		    }
		  }
	}, {
		tableName: 'DeterminationVotes',
		//	timestamps: false,
		freezeTableName: true,
    	classMethods: {

    		associate: function(models) {
			
		models.DeterminationVote
				.belongsTo(models.User, {
					foreignKey: "user_id" ,
					as: "User"
				});	
		models.DeterminationVote
				.belongsTo(models.Observation, {
					foreignKey: "observation_id" ,
					as: "Observation"
				});	
		models.Determination
				.hasMany(models.DeterminationVote, {
					foreignKey: "determination_id" ,
					as: "Votes"
				});			

					
				
    		}
		
  		}

	});

	return DeterminationVote;
};








