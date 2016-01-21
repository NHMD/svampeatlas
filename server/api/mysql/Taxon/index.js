'use strict';

var express = require('express');
var controller = require('./Taxon.controller');
var attributesController = require('../TaxonAttributes/TaxonAttributes.controller');
var imagesController = require('../TaxonImages/TaxonImages.controller');
var naturtypeController = require('../Naturtype/Naturtype.controller');
var nutritionStrategyController = require('../ErnaeringsStrategi/ErnaeringStrategi.controller');
var taxonomytagController = require('../TaxonomyTag/TaxonomyTag.controller');
var speciesHypothesisController = require('../TaxonSpeciesHypothesis/TaxonSpeciesHypothesis.controller');
var dkNamesController = require('../TaxonDKnames/TaxonDKnames.controller');
var auth = require('../../../auth/auth.service');
//var intparser = require('../../../components/hooks/parseLimitOffset');

var router = express.Router();

router.get('/', controller.index);
router.get('/updateallsystematicsbyid', controller.updateAllSystematicsById);
router.get('/updateallsystematicsbytypificationid', controller.updateAllSystematicsByTypificationId);
router.get('/syncallfunidsbynamematch', controller.syncAllFUNIdsByNameMatch);
router.get('/updateallidsbyname/:taxonrank', controller.updateAllFUNIdsByNameMatch);
router.get('/updateallidsbynameforunacceptedspecies', controller.syncAllFUNIdsByNameMatchForNewParentSpecies);
router.get('/tree', auth.hasRole('taxonomyadmin'), controller.showTree);
router.get('/:id', controller.show);
router.get('/:id/updatesystematics', controller.updateSystematics);


router.post('/', auth.hasRole('taxonomyadmin'), controller.create);
router.put('/:id',auth.hasRole('taxonomyadmin'),  controller.update);
router.patch('/:id',auth.hasRole('taxonomyadmin'),  controller.update);
router.delete('/:id',auth.hasRole('taxonomyadmin'),  controller.destroy);

router.post('/:id/parent', auth.hasRole('taxonomyadmin'), controller.setParent);
router.post('/:id/synonyms',auth.hasRole('taxonomyadmin'),  controller.addSynonym);
router.get('/:id/siblings', controller.showSiblings);

router.get('/:id/images', imagesController.showImages);
router.post('/:id/images',auth.hasRole('taxonomyadmin'),  imagesController.addImage);
router.put('/:id/images/:imgid',auth.hasRole('taxonomyadmin'),  imagesController.updateImage);
router.delete('/:id/images/:imgid',auth.hasRole('taxonomyadmin'),  imagesController.deleteImage);

router.post('/:id/attributes',auth.hasRole('taxonomyadmin'),   attributesController.create);
router.put('/:id/attributes',auth.hasRole('taxonomyadmin'),   attributesController.update);
router.delete('/:id/attributes',auth.hasRole('taxonomyadmin'),   attributesController.destroy);

router.get('/:id/naturetypes', naturtypeController.showTaxonNatureTypes);
router.post('/:id/naturetypes',auth.hasRole('taxonomyadmin'),  naturtypeController.addTaxonNatureType);
router.delete('/:id/naturetypes/:naturtypeid',auth.hasRole('taxonomyadmin'),  naturtypeController.deleteTaxonNatureType);

router.get('/:id/tags', taxonomytagController.showTaxonomyTags);
router.post('/:id/tags',auth.hasRole('taxonomyadmin'),  taxonomytagController.addTaxonomyTag);
router.delete('/:id/tags/:tagid',auth.hasRole('taxonomyadmin'),  taxonomytagController.deleteTaxonomyTag);

router.get('/:id/nutritionstrategies', nutritionStrategyController.showTaxonNutritionStrategies);
router.post('/:id/nutritionstrategies',auth.hasRole('taxonomyadmin'),  nutritionStrategyController.addTaxonNutritionStrategy);
router.delete('/:id/nutritionstrategies/:nutritionstrategyid',auth.hasRole('taxonomyadmin'),  nutritionStrategyController.deleteTaxonNutritionStrategy);

router.get('/:id/specieshypothesis', speciesHypothesisController.showSpeciesHypothesis);
router.post('/:id/specieshypothesis',auth.hasRole('taxonomyadmin'),  speciesHypothesisController.addSpeciesHypothesis);
router.delete('/:id/specieshypothesis/:spid',auth.hasRole('taxonomyadmin'),  speciesHypothesisController.deleteSpeciesHypothesis);

router.get('/:id/dknames', dkNamesController.showNames);
router.post('/:id/dknames',auth.hasRole('taxonomyadmin'),  dkNamesController.addName);
router.post('/:id/dknames/current/',auth.hasRole('taxonomyadmin'),  controller.setCurrentDkName);
router.put('/:id/dknames/:nameid',auth.hasRole('taxonomyadmin'),  dkNamesController.updateName);
router.delete('/:id/dknames/:nameid',auth.hasRole('taxonomyadmin'),  dkNamesController.deleteName);


module.exports = router;
