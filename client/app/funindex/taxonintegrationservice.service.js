'use strict';

angular.module('svampeatlasApp')
	.factory('TaxonIntegrationService', function() {

		return {
			setTaxon : function(taxon, source){
				var thisTaxon = {};
				if(source === "IndexFungorum"){
					
					thisTaxon.SystematicPath = taxon.SystematicPath + ", "+ this.getTaxonName(taxon);
					thisTaxon.FullName = taxon.NAME_x0020_OF_x0020_FUNGUS +" "+taxon.AUTHORS;
					thisTaxon.Author = taxon.AUTHORS;
					thisTaxon.FunIndexCurrUseNumber = (taxon.CURRENT_x0020_NAME_x0020_RECORD_x0020_NUMBER) ? taxon.CURRENT_x0020_NAME_x0020_RECORD_x0020_NUMBER : taxon.RECORD_x0020_NUMBER;
					thisTaxon.FunIndexTypificationNumber = this.getTypificationNumber(taxon);
					thisTaxon.FunIndexNumber = taxon.RECORD_x0020_NUMBER;
					thisTaxon.GUID = taxon.UUID;
					thisTaxon.RankName = taxon.INFRASPECIFIC_x0020_RANK;
					thisTaxon.TaxonName = this.getTaxonName(taxon);
				} else if(source === "MycoBank"){
					
				}
				
				this.taxon = thisTaxon;
				
			},
			
			getTypificationNumber : function(taxon){
				if(!taxon.TYPIFICATION_x0020_DETAILS) return 0;
				
				return taxon.TYPIFICATION_x0020_DETAILS.split("$")[0];
			},
			getTaxonName : function(taxon){
				if(taxon.INFRASPECIFIC_x0020_EPITHET) {return taxon.INFRASPECIFIC_x0020_EPITHET;}
				else if(taxon.SPECIFIC_x0020_EPITHET) {return taxon.SPECIFIC_x0020_EPITHET;}
				else if(taxon.NAME_x0020_OF_x0020_FUNGUS) {return taxon.NAME_x0020_OF_x0020_FUNGUS}
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