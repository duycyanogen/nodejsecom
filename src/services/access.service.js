"use strict";
const shopModel = require("../models/shop.models");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  AuthFailtureError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const RoleShop = {
  SHOP: "SHOP",
  WRITERL: "WRITER",
  EDITOR: "EDITOR",
};
class AccessService {
  static handleRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    if (foundToken) {
      console.log("found", foundToken);
      //decode xem payload co trong he thong khong?
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      await KeyTokenService.deleteByKeyId(userId);
      throw new ForbiddenError("Something went wrong! please relogin");
    }

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) {
      throw new AuthFailtureError("Shop not registered");
    }
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    const foundShop = findByEmail(email);
    if (!foundShop) throw new AuthFailtureError("Shop not registered");

    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });
    return {
      user: { userId, email },
      tokens,
    };
  };

  static handleRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user;
    if (!keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.deleteByKeyId(userId);
      throw new ForbiddenError("Something went wrong! please relogin");
    }
    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailtureError("Shop not registered");
    const foundShop = findByEmail(email);
    if (!foundShop) throw new AuthFailtureError("Shop not registered");

    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });
    return {
      user,
      tokens,
    };
  };

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  };
  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });
    //Check email in dbs
    if (!foundShop) {
      throw new BadRequestError("Error: Shop doesn't exist");
    }
    //match password
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailtureError("Incorrect password!");
    }
    //create private key, public key
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    //generate tokens
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId: foundShop._id,
    });
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };
  static signUp = async ({ name, email, password }) => {
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: Shop already exist");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: hashPassword,
      roles: [RoleShop.SHOP],
    });
    if (newShop) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      //tạo cặp key bằng thuật toán RSA
      //tạo public key string, lưu vào database ref tới user vừa tạo ra
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });
      if (!keyStore) {
        throw new BadRequestError("Error: Public keyString error");
      }
      //sinh refreshToken và accesss token, payload là thông tin vừa sinh ra
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
