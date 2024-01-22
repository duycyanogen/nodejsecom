"use strict";
const AccessService = require("../services/access.service");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");
class AccessController {
  handleRefreshToken = async (req, res, next) => {
    // return new SuccessResponse({
    //   message: "get token success",
    //   metadata: await AccessService.handleRefreshToken(req.body.refreshToken),
    // }).send(res);
    //v2 fixed, khoong caan accessToken
    return new SuccessResponse({
      message: "get token success",
      metadata: await AccessService.handleRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };

  logout = async (req, res, next) => {
    return new SuccessResponse({
      message: "logout success",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  login = async (req, res, next) => {
    return new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    return new CREATED({
      message: "Registered OK!",
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };
}

module.exports = new AccessController();
