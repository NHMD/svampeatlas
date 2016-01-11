CREATE VIEW ObservationView AS SELECT 
o._id ,
o.createdAt ,
o.updatedAt ,
o.observationDate ,
o.observationDateAccuracy,
o.locality_id,
o.verbatimLocality,
o.primaryuser_id,
o.verbatimLeg ,
o.primarydetermination_id,
o.primaryassociatedorganism_id ,
o.vegetationtype_id,
o.substrate_id ,
o.ecologynote ,
o.decimalLatitude,
o.decimalLongitude ,
o.accuracy ,
o.atlasUUID ,
o.fieldnumber ,
o.herbarium,
o.note ,
o.noteInternal,
o.dataSource ,
p.p as geom
FROM Observation o, ObservationPoint p where o._id=p.observation_id;




CREATE VIEW ObservationView AS SELECT 
o._id ,
o.createdAt ,
o.updatedAt ,
o.observationDate ,
o.observationDateAccuracy,
o.locality_id,
o.verbatimLocality,
o.primaryuser_id,
o.verbatimLeg ,
o.primarydetermination_id,
o.primaryassociatedorganism_id ,
o.vegetationtype_id,
o.substrate_id ,
o.ecologynote ,
o.decimalLatitude,
o.decimalLongitude ,
o.accuracy ,
o.atlasUUID ,
o.fieldnumber ,
o.herbarium,
o.note ,
o.noteInternal,
o.dataSource ,
d._id as Determination_id ,
d.createdAt as Determination_createdAt ,
d.updatedAt as Determination_updatedAt ,
d.observation_id as Determination_observation_id ,
d.taxon_id as Determination_taxon_id ,
d.user_id as Determination_user_id ,
d.confidence as Determination_confidence ,
d.score as Determination_score ,
d.validation as Determination_validation ,
d.notes as Determination_notes ,
d.validatorremarks as Determination_validatorremarks ,
d.validator_id as Determination_validator_id ,
d.verbatimdeterminator as Determination_verbatimdeterminator ,
t._id as Taxon_id ,
 t.createdAt Taxon_createdAt ,
  t.updatedAt Taxon_updatedAt ,
  t.Path Taxon_Path ,
  t.SystematicPath Taxon_SystematicPath ,
  t.Version Taxon_Version ,
  t.FullName Taxon_FullName ,
  t.GUID Taxon_GUID ,
  t.FunIndexTypificationNumber Taxon_FunIndexTypificationNumber ,
  t.FunIndexCurrUseNumber Taxon_FunIndexCurrUseNumber ,
  t.FunIndexNumber Taxon_FunIndexNumber ,
  t.RankID Taxon_RankID ,
  t.RankName Taxon_RankName ,
  t.TaxonName Taxon_TaxonName ,
  t.Author Taxon_Author ,
  t.vernacularname_dk Taxon_vernacularname_dk ,
  t.parent_id Taxon_parent_id ,
  t.accepted_id Taxon_accepted_id,
 l._id as Loc_id ,
 l.createdAt as Locality_createdAt ,
  l.updatedAt as Locality_updatedAt ,
  l.name as Locality_name ,
  l.decimalLatitude as Locality_decimalLatitude ,
  l.decimalLongitude as Locality_decimalLongitude ,
  l.accuracy as Locality_accuracy ,
  l.utm_northing as Locality_utm_northing ,
  l.utm_easting as Locality_utm_easting ,
  l.utm10 as Locality_utm10 ,
  l.kommune as Locality_kommune ,
  l.source as Locality_source ,
  l.description as Locality_description ,
  l.moderator as Locality_moderator ,
  l.include as Locality_include ,
  l.mainlocality as Locality_mainlocality ,
    u._id as User_id ,
      u.name as User_name ,
      u.email as User_email ,
      u.Validation as User_Validation ,
      u.Initialer as User_Initialer ,
      u.preferred_language as User_preferred_language 
FROM Observation o, Determination d, Taxon t, Locality l, Users u 
WHERE o.primarydetermination_id=d._id AND t._id=d.taxon_id AND o.locality_id = l._id AND o.primaryuser_id=u._id;


/*
'use strict';
var _ = require('lodash');
var validatePresenceOf = function(value) {
  return value && value.length;
};

module.exports = function(sequelize, DataTypes) {
  var ObservationView = sequelize.define('ObservationView', {

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
   },
   observationDate: {
   	type: DataTypes.DATE,
   	allowNull: false
   },
   observationDateAccuracy: {
   	type: DataTypes.ENUM('day', 'month', 'year', 'invalid'),
   	allowNull: false,
   	defaultValue: 'day'
   },
   locality_id: {
   	type: DataTypes.INTEGER,
   	allowNull: true,
   },
   verbatimLocality: {
   	type: DataTypes.STRING,
   	allowNull: true,
   },
   primaryuser_id: {
   	type: DataTypes.INTEGER,
   	allowNull: true,
   },
   verbatimLeg: {
   	type: DataTypes.STRING,
   	allowNull: true,
   },
   primarydetermination_id: {
   	type: DataTypes.INTEGER,
   	allowNull: true,
   },
   primaryassociatedorganism_id: {
   	type: DataTypes.INTEGER,
   	allowNull: true,
   },
   vegetationtype_id: {
   	type: DataTypes.INTEGER,
   	allowNull: true,
   },
   substrate_id: {
   	type: DataTypes.INTEGER,
   	allowNull: true,
   },
   ecologynote: {
   	type: DataTypes.TEXT,
   	allowNull: true,
   },
   decimalLatitude: {
   	type: DataTypes.DOUBLE,
   	allowNull: false,
   },
   decimalLongitude: {
   	type: DataTypes.DOUBLE,
   	allowNull: false,
   },
   accuracy: {
   	type: DataTypes.INTEGER,
   	allowNull: true,
   },
   atlasUUID: {
   	type: DataTypes.UUID,
   	allowNull: true,
   	defaultValue: DataTypes.UUIDV1
   },
   fieldnumber: {
   	type: DataTypes.STRING,
   	allowNull: true,
   },
   herbarium: {
   	type: DataTypes.STRING,
   	allowNull: true,
   },
   note: {
   	type: DataTypes.TEXT,
   	allowNull: true,
   },
   noteInternal: {
   	type: DataTypes.TEXT,
   	allowNull: true,
   },
   dataSource: {
   	type: DataTypes.STRING,
   	allowNull: true,
   },
   Determination_id: {
  	type: DataTypes.INTEGER,
  	allowNull: false,
  },
  Determination_createdAt: {
  	type: DataTypes.DATE,
  	allowNull: false,
  	defaultValue: DataTypes.NOW
  },
  Determination_updatedAt: {
  	type: DataTypes.DATE,
  	allowNull: true,
  },
  Determination_observation_id: {
  	type: DataTypes.INTEGER,
  	allowNull: false,
  },
  Determination_taxon_id: {
  	type: DataTypes.INTEGER,
  	allowNull: false,
   references: {
         model: "Taxon",
         key: "_id"
       }
  },
  Determination_user_id: {
  	type: DataTypes.INTEGER,
  	allowNull: true,
  },
  Determination_confidence: {
  	type: DataTypes.ENUM('sikker','sandsynlig','mulig'),
  	allowNull: true
  },
  Determination_score: {
  	type: DataTypes.INTEGER,
  	allowNull: false,
   defaultValue: 0   
  },
  Determination_validation: {
  	type: DataTypes.ENUM('Godkendt','Gammelvali','Valideres','Afventer','Afvist','Slettes'),
  	allowNull: true
  },
  Determination_notes: {
  	type: DataTypes.TEXT,
  	allowNull: true,
  },
  
  Determination_validatorremarks: {
  	type: DataTypes.STRING,
  	allowNull: true,
  },
  Determination_validator_id: {
  	type: DataTypes.INTEGER,
  	allowNull: true,
  },
  
  Determination_verbatimdeterminator: {
  	type: DataTypes.STRING,
  	allowNull: true
  },
  // tax
   Taxon_id: {
     type: DataTypes.INTEGER,
     allowNull: false
   },
   Taxon_createdAt: {
     type: DataTypes.DATE,
     allowNull: false,
     defaultValue: DataTypes.NOW
   },
   Taxon_updatedAt: {
     type: DataTypes.DATE,
     allowNull: true,
   },
   Taxon_Path: {
     type: DataTypes.STRING,
     allowNull: true,
   },
   Taxon_SystematicPath: {
     type: DataTypes.STRING,
     allowNull: true,
   },
   Taxon_Version: {
     type: DataTypes.INTEGER(11),
     allowNull: true,
   },
   Taxon_FullName: {
     type: DataTypes.STRING,
     allowNull: true,
   },
   Taxon_GUID: {
	type: DataTypes.UUID,
	allowNull: true,
	defaultValue: DataTypes.UUIDV1
   },    
   Taxon_FunIndexCurrUseNumber: {
     type: DataTypes.INTEGER(11),
	allowNull: true,
   defaultValue: null,
   }, 
   Taxon_FunIndexTypificationNumber: {
     type: DataTypes.INTEGER(11),
     allowNull: false,
   }, 
   Taxon_FunIndexNumber: {
     type: DataTypes.INTEGER(11),
allowNull: true,
   defaultValue: null,
   },
   Taxon_RankID: {
     type: DataTypes.INTEGER(11),
     allowNull: false,
   },
   Taxon_RankName: {
     type: DataTypes.STRING,
     allowNull: true,
   },
   Taxon_TaxonName: {
     type: DataTypes.STRING,
     allowNull: false,
   },
   Taxon_Author: {
     type: DataTypes.STRING,
     allowNull: true,
   },
Taxon_vernacularname_dk :{
     type: DataTypes.STRING,
     allowNull: true,
   },
  //loc
   
   Loc_id: {
  	type: DataTypes.INTEGER,
  	allowNull: false
  },
  Locality_createdAt: {
  	type: DataTypes.DATE,
  	allowNull: false,
  	defaultValue: DataTypes.NOW
  },
  Locality_updatedAt: {
  	type: DataTypes.DATE,
  	allowNull: true,
  },
  Locality_name: {
  	type: DataTypes.STRING,
  	allowNull: false,
  },
  Locality_decimalLatitude: {
  	type: DataTypes.DECIMAL(10,8),
  	allowNull: false,
  },
  Locality_decimalLongitude: {
  	type: DataTypes.DECIMAL(11,8),
  	allowNull: false,
  },
  Locality_accuracy: {
  	type: DataTypes.INTEGER,
  	allowNull: true,
  },
  Locality_utm_northing: {
  	type: DataTypes.INTEGER,
  	allowNull: true,
  },
  Locality_utm_easting: {
  	type: DataTypes.INTEGER,
  	allowNull: true,
  },
  Locality_utm10: {
  	type: DataTypes.STRING,
  	allowNull: true,
  },
  Locality_kommune: {
  	type: DataTypes.STRING,
  	allowNull: true,
  },
  Locality_source: {
  	type: DataTypes.STRING,
  	allowNull: true,
  },
  Locality_description: {
  	type: DataTypes.TEXT,
  	allowNull: true,
  },
  Locality_moderator: {
  	type: DataTypes.STRING,
  	allowNull: true,
  },
  Locality_include: {
  	type: DataTypes.BOOLEAN,
  	allowNull: false,
  },
  Locality_mainlocality: {
  	type: DataTypes.BOOLEAN,
  	allowNull: false,
  },
  
  //user
  User_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  User_name: DataTypes.STRING,
  User_email: {
    type: DataTypes.STRING,
  
	
    validate: {
      isEmail: true
    }
  },

User_Initialer: { type: DataTypes.STRING,
  
    unique: {
        msg: 'The specified initials are already in use.'
      }
	
},
User_Validation: {
	type: DataTypes.INTEGER,
	defaultValue: 0	
},
User_preferred_language: DataTypes.ENUM('dk', 'en')

  }, {
    	tableName: 'ObservationView',
    	timestamps: true,
    	freezeTableName: true,
	  managed: false,
    	classMethods: {

    		associate: function(models) {
				
				models.ObservationForum.belongsTo(models.ObservationView, {
				  
				  foreignKey: '_id',
					as: 'Observation'
				});
				
		models.ObservationView
				.hasMany(models.ObservationForum, {
					foreignKey: "observation_id",
					as: "Forum"
				});	
				
				models.ObservationImage.belongsTo(models.ObservationView, {
				  
				  foreignKey: '_id',
					as: 'Observation'
				});
				
		models.ObservationView
				.hasMany(models.ObservationImage, {
					foreignKey: "observation_id",
					as: "Images"
				});	
				
				

					
				
    		}
		
  		},

      hooks: {

	  
  	  
      },


      instanceMethods: {
  
      }

  
  });

  return ObservationView;
};
*/