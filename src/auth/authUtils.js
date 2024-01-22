"use strict";

const jwt = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailtureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");
const HEADER = {
  APY_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-rtoken-id",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await jwt.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    const refreshToken = await jwt.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log(`error verify::`, err);
      } else {
        console.log(`decode::`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  //check userId missing?
  //get access token
  //verify token
  //check user in dbs?
  //check keyStore with this userId
  //return next
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailtureError("Invalid request");
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found key store");
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailtureError("Invalid request");
  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailtureError("Invalid userId");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const authenticationV2 = asyncHandler(async (req, res, next) => {
  //check userId missing?
  //get access token
  //verify token
  //check user in dbs?
  //check keyStore with this userId
  //return next
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailtureError("Invalid request");
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found key store");
  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.header[HEADER.REFRESHTOKEN];
      const decodeUser = jwt.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId)
        throw new AuthFailtureError("Invalid userId");
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw err;
    }
  }
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailtureError("Invalid request");
  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailtureError("Invalid userId");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  return await jwt.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  authenticationV2,
  verifyJWT,
};
