require('dotenv').config()
const shortid = require("shortid");
const validUrl = require("valid-url");
const UrlStore = require("../models/UrlStore.json").data;

const createShortUrl = async (req, res, next) => {
  try {
    shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
    const longUrl = req.body.longUrl;
    const urlCode = req.body.urlCode
    const baseUrl = process.env.baseURL;
    const urlCodeGen = shortid.generate().slice(0, 6);
    const urlCoded = urlCode || urlCodeGen;
    const shortUrl = baseUrl + urlCoded;

    let validationError = {};

    if (longUrl === undefined || longUrl === null || longUrl.length < 4) {
      validationError.longUrl = 'Must be at least 4 characters.';
    } else {
      if (!validUrl.isUri(longUrl)) {
        validationError.longUrl = 'Invalid URl, Please enter a valid URL.';
      }
    }

    if (urlCode !== undefined && urlCode !== null) {
      if (urlCode.length < 4) { validationError.urlCode = 'Must be at least 4 characters.'; }
      else {
        if (!validUrl.isUri(shortUrl)) {
          validationError.urlCode = 'Invalid shortcode, shortcodes can only contain digits, upper case letters, and lowercase letters.';
        }
      }

      let urlCodeExists = UrlStore.find(url => url.urlCode === urlCode)

      if (urlCodeExists !== undefined) {
        validationError.urlCode = "Url Code already exists.";
      }

    }


    if (Object.keys(validationError).length > 0) {
      return res.status(422).json({
        'code': 'REQUIRED_FIELDS_MISSING',
        'message': 'Your submission contains one or more invalid fields',
        'errors': validationError
      });
    }


    const allowedParams = {
      longUrl,
      shortUrl,
      urlCode: urlCoded,
      clickCount: 0,
      createdAt: Date.now(),
      lastVisitedAt: null,
    };

    UrlStore.push({ ...allowedParams });

    return res.status(201).json({
      'message': 'Short Url created successfully',
      'data': UrlStore[UrlStore.length - 1]
    });

  } catch (error) {
    return res.status(500).json({
      'code': 'SERVER_ERROR',
      'message': 'something went wrong, Please try again',
      'error': error.message
    });
  }
}

const redirectToLongUrl = async (req, res, next) => {
  try {
    let url = UrlStore.find(url => url.urlCode === req.params.shortcode);

    if (url !== undefined) {

      res.redirect(url.longUrl);

      return UrlStore.forEach(url => {
        if (url.urlCode === req.params.shortcode) {
          url.clickCount++
          url.lastVisitedAt = Date.now()
        }
      });
    }

    return res.status(404).json({
      'code': 'BAD_REQUEST_ERROR',
      'description': 'Shortcode not found'
    });

  } catch (error) {
    return res.status(500).json({
      'code': 'SERVER_ERROR',
      'description': 'something went wrong, Please try again',
      'error': error.message
    });
  }
}

const getShortCodeStats = async (req, res, next) => {
  try {
    let url = UrlStore.find(url => url.urlCode === req.params.shortcode);

    if (url !== undefined) {
      return res.status(200).json({
        'message': 'shortcode stats successfully fetched',
        'data': url
      });
    }

    return res.status(404).json({
      'code': 'BAD_REQUEST_ERROR',
      'description': 'Shortcode not found'
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
  redirectToLongUrl,
  getShortCodeStats
}