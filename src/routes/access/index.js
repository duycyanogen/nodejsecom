'use strict'

const express = require('express');
const router = express.Router();
const accessController = require('../../controllers/acess.controller')
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication, authenticationV2 } = require('../../auth/authUtils');
//signUp
router.post('/shop/signup',asyncHandler(accessController.signUp));
router.post('/shop/login',asyncHandler(accessController.login));

//authentication
router.use(authenticationV2)
//
router.post('/shop/logout',asyncHandler(accessController.logout));
router.post('/shop/handleRefreshToken',asyncHandler(accessController.handleRefreshToken));
module.exports = router;