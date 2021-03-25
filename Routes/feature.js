const express = require('express');
const router = express.Router();
const FeatureController = require("../Controllers/feature");
const { verifyAccessTokenForUserId } =require('../Helpers/validate');
const { getFeatureAccess } = require('../Helpers/role');

//Post feature.
router.post('/add/', verifyAccessTokenForUserId, getFeatureAccess, FeatureController.postFeature);

//Get feature.
router.get('/list/', verifyAccessTokenForUserId, getFeatureAccess, FeatureController.getFeature);

//Get feature by id.
router.get('/get/:featureID', verifyAccessTokenForUserId, getFeatureAccess, FeatureController.getFeatureById)

//Update traceability report.
router.put('/update/:featureID', verifyAccessTokenForUserId, getFeatureAccess, FeatureController.updateFeature);

//Delete traceability.
router.delete('/remove/:featureID', verifyAccessTokenForUserId, getFeatureAccess, FeatureController.deleteFeature);

module.exports =router;