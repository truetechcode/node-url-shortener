require('dotenv').config()
const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const faker = require("faker");
const UrlController = require('../../controllers/url').urlController;

describe("UrlController", function () {
  describe("Create Short Url", function () {
    let baseUrl = process.env.baseURL;
    let status, json, res;

    beforeEach(() => {
      status = sinon.stub();
      json = sinon.spy();
      res = { json, status };
      status.returns(res);
      shortcode = faker.random.alphaNumeric(6);
      shortUrl = baseUrl + '/' + shortcode
    });

    it("should not create a new short url when longurl param is not provided", async function () {
      const req = { body: { urlCode: faker.random.uuid() } };

      UrlController.createShortUrl(req, res);

      expect(res.status.calledOnce).to.be.true;
      expect(res.status.firstCall.args[0]).to.equal(422);
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0].message).to.equal("Your submission contains one or more invalid fields");
    });


    it("should create a new short url when shortcode param is not provided", async function () {
      const req = { body: { longUrl: faker.internet.url() } };

      UrlController.createShortUrl(req, res);

      expect(res.status.calledOnce).to.be.true;
      expect(res.status.firstCall.args[0]).to.equal(201);
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0].message).to.equal("Short Url created successfully");
    });
  });


});