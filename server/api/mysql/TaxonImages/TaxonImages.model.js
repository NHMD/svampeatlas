'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TaxonImages', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    uri: DataTypes.STRING,
    photographer: DataTypes.STRING,
    country: DataTypes.STRING,
	collectionNumber: DataTypes.STRING
  },{
    	tableName: 'TaxonImages',
    //	timestamps: false,
    	freezeTableName: true,
    	
  });
};

