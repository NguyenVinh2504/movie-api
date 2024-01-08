"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storage = exports.app = void 0;
var _app = require("firebase/app");
var _storage = require("firebase/storage");
// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: 'AIzaSyBjQeMNDZRNegNQh4Rvxfa7fGvmPP4XVWk',
  authDomain: 'movie-app-8766b.firebaseapp.com',
  projectId: 'movie-app-8766b',
  storageBucket: 'movie-app-8766b.appspot.com',
  messagingSenderId: '1034136927694',
  appId: '1:1034136927694:web:45c53b288bf84ca4d23f9f',
  measurementId: 'G-8LWHS6DR2T'
};

// Initialize Firebase
var app = (0, _app.initializeApp)(firebaseConfig);
exports.app = app;
var storage = (0, _storage.getStorage)(app);
exports.storage = storage;