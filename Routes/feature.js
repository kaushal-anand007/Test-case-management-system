const express=require('express');
const router =express.Router();
const FeatureController = require("../Controllers/feature");
const { verifyAccessTokenForUserId } =require('../Helpers/validate');

//Post feature.
router.post('/add', verifyAccessTokenForUserId, FeatureController.postFeature);

//Get feature.
router.get('/get-all', verifyAccessTokenForUserId, FeatureController.getFeature);

//Get feature by id.
router.get('/get/:featureID', verifyAccessTokenForUserId, FeatureController.getFeatureById)

//Update traceability report.
router.put('/update/:featureID', verifyAccessTokenForUserId, FeatureController.updateFeature);

//Delete traceability.
router.delete('/remove:featureID', verifyAccessTokenForUserId, FeatureController.deleteFeature);

module.exports =router;