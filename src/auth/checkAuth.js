"use strict";

const { findById } = require("../services/apikey.service");

const HEADER = {
  APY_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};
const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.APY_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "forbidden",
      });
    }
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: "forbidden",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {
    console.log(error);
  }
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "permisson denied!",
      });
    }
    const validPermisson = req.objKey.permissions.includes(permission);
    if (!validPermisson) {
      return res.status(403).json({
        message: "permission denied!",
      });
    }
    return next();
  };
};



module.exports = {
  apiKey,
  permission,
};
