"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.env = void 0;
require("dotenv/config.js");
var env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  LOCAL_DEV_APP_HOST: process.env.LOCAL_DEV_APP_HOST,
  LOCAL_DEV_APP_PORT: process.env.LOCAL_DEV_APP_PORT,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  BUILD_MODE: process.env.BUILD_MODE,
  AUTHOR: process.env.AUTHOR,
  TMDB_KEY: process.env.TMDB_KEY,
  TMDB_BASE_URL: process.env.TMDB_BASE_URL,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_NAME: process.env.EMAIL_NAME,
  CLIENT_URL_REDIRECT: process.env.CLIENT_URL_REDIRECT,
  CLIENT_ID_GOOGLE: process.env.CLIENT_ID_GOOGLE,
  REDIRECT_URI: process.env.REDIRECT_URI,
  CLIENT_SECRET: process.env.CLIENT_SECRET
};
exports.env = env;