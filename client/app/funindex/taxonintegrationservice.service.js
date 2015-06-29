'use strict';

angular.module('svampeatlasApp')
	.factory('TaxonIntegrationService', function(Taxon) {

		return {
			setTaxon: function(taxon, source) {
				this.taxon = undefined;

				var that = this;
				if (source === "IndexFungorum") {
					this.taxon = Taxon.query({
						where: {
							SystematicPath: taxon.SystematicPath
						}
					}).$promise.then(function(parents) {
						var thisTaxon = {};
						thisTaxon.dataSource = source;
						thisTaxon.SystematicPath = taxon.SystematicPath + ", " + that.getTaxonName(taxon);
						thisTaxon.FullName = taxon.NAME_x0020_OF_x0020_FUNGUS + " " + taxon.AUTHORS;
						thisTaxon.Author = taxon.AUTHORS;
						thisTaxon.FunIndexCurrUseNumber = (taxon.CURRENT_x0020_NAME_x0020_RECORD_x0020_NUMBER) ? taxon.CURRENT_x0020_NAME_x0020_RECORD_x0020_NUMBER : taxon.RECORD_x0020_NUMBER;
						thisTaxon.FunIndexTypificationNumber = that.getTypificationNumber(taxon);
						thisTaxon.FunIndexNumber = taxon.RECORD_x0020_NUMBER;
						thisTaxon.GUID = taxon.UUID;
						thisTaxon.RankName = taxon.INFRASPECIFIC_x0020_RANK;
						thisTaxon.RankID = that.getRankID(taxon.INFRASPECIFIC_x0020_RANK);
						thisTaxon.TaxonName = that.getTaxonName(taxon);
						if (parents.length > 0) {
							thisTaxon.Parent = parents[0];
						} else {
							thisTaxon.Parent = null;
						}

						return thisTaxon;

					});

				} else if (source === "MycoBank") {

					var splittedSysPath = taxon.SystematicPath.split("?, ");
					var query = {};
					if (splittedSysPath.length === 2) {
						query.where = {
							$and: [{
								SystematicPath: {
									$like: '%'+splittedSysPath[1]
								}
							}, {
								SystematicPath: {
									$like: splittedSysPath[0]+'%'
								}}]
						};
					} else {
						query.where = {
							SystematicPath: taxon.SystematicPath
						};
					}
					
					this.taxon = Taxon.query(query).$promise.then(function(parents) {
						var thisTaxon = {};
						thisTaxon.dataSource = source;
						thisTaxon.SystematicPath = taxon.SystematicPath + ", " + taxon.Epithet_;
						thisTaxon.FullName = taxon.Name + " " + taxon.Authors_;
						thisTaxon.Author = taxon.Authors_;
						thisTaxon.FunIndexCurrUseNumber = taxon.FunIndexCurrUseNumber;
						thisTaxon.FunIndexTypificationNumber = 0;
						thisTaxon.FunIndexNumber = taxon.MycoBankNr_;

						thisTaxon.RankName = taxon.RankName;
						thisTaxon.RankID = that.getRankID(taxon.RankName);
						thisTaxon.TaxonName = taxon.Epithet_;
						if (parents.length > 0) {
							thisTaxon.Parent = parents[0];
						} else {
							thisTaxon.Parent = null;
						}

						return thisTaxon;

					});
				}



			},

			getTypificationNumber: function(taxon) {
				if (!taxon.TYPIFICATION_x0020_DETAILS) return 0;

				return taxon.TYPIFICATION_x0020_DETAILS.split("$")[0];
			},
			getTaxonName: function(taxon) {
				if (taxon.INFRASPECIFIC_x0020_EPITHET) {
					return taxon.INFRASPECIFIC_x0020_EPITHET;
				} else if (taxon.SPECIFIC_x0020_EPITHET) {
					return taxon.SPECIFIC_x0020_EPITHET;
				} else if (taxon.NAME_x0020_OF_x0020_FUNGUS) {
					return taxon.NAME_x0020_OF_x0020_FUNGUS
				}
			},

			getRankID: function(rank) {

				switch (rank) {
					case "life":
						return 0;
						break;
					case "regn.":
						return 100;
						break;
					case "phyl.":
						return 500;
						break;
					case "subphyl.":
						return 1000;
						break;
					case "class.":
						return 1500;
						break;
					case "subclass.":
						return 2000;
						break;
					case "ord.":
						return 3000;
						break;
					case "fam.":
						return 4000;
						break;
					case "gen.":
						return 5000;
						break;
					case "sp.":
						return 10000;
						break;
					case "subsp.":
						return 11000;
						break;
					case "var.":
						return 12000;
						break;
					case "f.":
						return 13000;
						break;
					case "f.sp.":
						return 14000;
						break;
				};
			}
		};


	});

/*

    SystematicPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    FullName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    GUID: {
		type: DataTypes.UUID,
		allowNull: true,
		defaultValue: DataTypes.UUIDV1
    },
    IsAccepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },    
    FunIndexCurrUseNumber: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }, 
    FunIndexTypificationNumber: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }, 
    FunIndexNumber: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    RankID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    RankName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    TaxonName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Author: {
      type: DataTypes.STRING,
      allowNull: true,
    },
	*/
