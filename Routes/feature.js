const express = require('express');
const router = express.Router();
const FeatureController = require("../Controllers/feature");
const { verifyAccessTokenForUserId } =require('../Helpers/validate');
const { getFeatureAccess } = require('../Helpers/role');

//Post feature.
router.post('/add/', verifyAccessTokenForUserId, FeatureController.postFeature);

//Get feature.
router.get('/list/', verifyAccessTokenForUserId, FeatureController.getFeature);

//Get feature.
router.get('/get/:featureID', verifyAccessTokenForUserId, getFeatureAccess, FeatureController.getFeatureById)

//Update feature.
router.put('/update/:featureID', verifyAccessTokenForUserId, FeatureController.updateFeature);

//Delete feature.
router.delete('/delete/:featureID', verifyAccessTokenForUserId, FeatureController.deleteFeature);

//Change feature condition.
router.put('/remove/:featureID', verifyAccessTokenForUserId, FeatureController.changeFeatureCondition);

module.exports =router;