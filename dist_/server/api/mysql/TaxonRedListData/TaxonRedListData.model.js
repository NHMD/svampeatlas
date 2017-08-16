'use strict';


module.exports = function(sequelize, DataTypes) {
	var TaxonRedListData = sequelize.define('TaxonRedListData', {
		_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		taxon_id: {
			type: DataTypes.INTEGER,
			allowNull: false
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
		Status: {
			type: DataTypes.ENUM('LC', 'NT', 'VU', 'EN', 'CR','RE', 'DD', 'NA', 'NE')
		},
		year: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		Artstilbagegang: DataTypes.INTEGER,
		VerbatimStatus: DataTypes.STRING,
		StatusDK: {
			type: DataTypes.ENUM('DK', 'Rare', 'Vulnerable', 'Endangered', 'Observation', 'extinct', 'New')
		},
		StatusTal: DataTypes.INTEGER,
		Roedlisteansvarlig: DataTypes.STRING,
		roedlisteBestandsstoerrelse: DataTypes.INTEGER,
		roedlisteBestandsstoerrelseAar: DataTypes.INTEGER,
		roedlisteBestandsstoerrelseBem:  DataTypes.STRING,
		roedlisteBestandsudvikling:  DataTypes.STRING,
		roedlisteGenerationsinterval:  DataTypes.INTEGER,
		roedlisteGenerationstid: DataTypes.INTEGER,
		roedlisteGruppe: DataTypes.ENUM('Barksvampe', 'Bladhatte', 'Bugsvampe', 'Bægersvampe', 'Bævresvampe', 'Kantareller og Trompetsvampe', 'Kernesvampe', 'Kølle- og Koralsvampe', 'Pigsvampe', 'Poresvampe', 'Rørhatte', 'Skivesvampe', 'Skørhatte og Mælkehatte', 'Trøfler', 'Vedboende pigsvampe'),
		roedlisteID: DataTypes.INTEGER,
		roedlisteIndivider: DataTypes.INTEGER,
		roedlisteLevesteder: DataTypes.STRING,
		roedlisteNationalStatus: DataTypes.STRING,
		roedlisteNationalStatusClean: DataTypes.STRING,
		roedlisteNegativePaavirknBem: DataTypes.STRING,
		roedlisteNegativePaavirkninger: DataTypes.STRING,
		roedlisteNomenkaltur: DataTypes.STRING,
		roedlisteUdbredelsesareal: DataTypes.INTEGER,
		Roedlistevurdering: DataTypes.STRING,
		NationalRoedlistekatogeri: DataTypes.STRING,
		Udbredelse: DataTypes.STRING,
		Litteratur: DataTypes.STRING,
		Litteratur_DMU: DataTypes.STRING,
		Kriterier: DataTypes.STRING
	}, {
		tableName: 'TaxonRedListData',
		//	timestamps: false,
		freezeTableName: true,

	});

	return TaxonRedListData;
};
