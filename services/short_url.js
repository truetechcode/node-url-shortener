require('dotenv').config()
const shortid = require("shortid");
const validUrl = require("valid-url");
const UrlStore = require("../models/UrlStore.json").data;

const createShortUrl = async (req, res, next) => {
  try {
    shortid.characters('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

    const longUrl = req.body.longUrl;
    const urlCode = req.body.urlCode
    const baseUrl = process.env.baseURL;
    const urlCodeGen = shortid.generate().slice(0, 6);

    if (!validUrl.isUri(baseUrl)) {
      return res.status(401).json("Internal error. Please come back later.");
    }

    console.log(req.body)

    let validationError = {};

    if (longUrl === undefined || longUrl === null || longUrl.length < 4) {
      validationError.longUrl = 'Must be at least 4 characters.';
    } else {
      if (!validUrl.isUri(longUrl)) {
        validationError.longUrl = 'Invalid URl, Please enter a valid URL.';
      }
    }

    if (urlCode === undefined || urlCode === null || urlCode.length < 10) {
      validationError.description = 'Must be at least 10 characters.';
    }

    if (Object.keys(validationError).length > 0) {
      return res.status(422).json({
        'code': 'REQUIRED_FIELDS_MISSING',
        'description': 'Your submission contains one or more invalid fields',
        'errors': validationError
      });
    }

    const shortUrl = baseUrl + '/' + urlCode;

    const allowedParams = {
      longUrl,
      shortUrl,
      urlCode: urlCode || urlCodeGen
    };

    let newShortUrl;

    newShortUrl = UrlStore.push({ ...allowedParams });


    return res.status(201).json({
      'message': 'Short Url created successfully',
      'data': UrlStore[UrlStore.length - 1]
    });

  } catch (error) {
    return res.status(500).json({
      'code': 'SERVER_ERROR',
      'description': 'something went wrong, Please try again',
      'error': error.message
    });
  }
}

module.exports = {
  createShortUrl,
}