"use strict";

const { mongo, Types } = require("mongoose");
const keytokenModel = require("../models/keytoken.model");
class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      //level 0
      // const token = await keytokenModel.create({
      //   user: userId,
      //   publicKey: publicKey,
      //   privateKey: privateKey
      // });
      //return token ? token.publicKey : null;
      //level xx
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokenUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };
      const token = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return token ? token.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keytokenModel
      .findOne({ user: new Types.ObjectId(userId) });
  };

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne(id);
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel
      .findOne({ refreshTokenUsed: refreshToken })
      .lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken });
  };

  static deleteByKeyId = async (userId) => {
    return await keytokenModel
      .findByIdAndDelete({ user: new Types.ObjectId(userId) })
      .lean();
  };
}

module.exports = KeyTokenService;
