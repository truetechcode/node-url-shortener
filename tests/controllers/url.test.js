require('dotenv').config()
const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const faker = require("faker");
const UrlController = require('../../controllers/url').urlController;
const UrlStore = require("../../models/UrlStore.json").data;

describe("UrlController", function () {
  describe("Create Short Url", function () {
    let status, json, res;

    beforeEach(() => {
      status = sinon.stub();
      json = sinon.spy();
      res = { json, status };
      status.returns(res);
    });

    it("should not create a new short url when longurl is not provided", async function () {
      const req = { body: { urlCode: faker.random.uuid() } };

      UrlController.createShortUrl(req, res);

      expect(res.status.calledOnce).to.be.true;
      expect(res.status.firstCall.args[0]).to.equal(422);
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0].message).to.equal("Your submission contains one or more invalid fields");
    });


    it("should create a new short url when shortcode is not provided", async function () {
      const req = { body: { longUrl: faker.internet.url() } };

      UrlController.createShortUrl(req, res);

      expect(res.status.calledOnce).to.be.true;
      expect(res.status.firstCall.args[0]).to.equal(201);
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0].message).to.equal("Short Url created successfully");
    });
  });

  describe("Redirect To Long Url", function () {
    let status, json, res;

    beforeEach(() => {
      status = sinon.stub();
      json = sinon.spy();
      res = { json, status };
      status.returns(res);
    });
    afterEach(() => {
      status.reset();
    })

    it("should return status 404 when shortcode is not found", async function () {

      let req = { params: { shortcode: faker.random.alphaNumeric(6) } };

      UrlController.redirectToLongUrl(req, res);

      expect(res.status.calledOnce).to.be.true;
      expect(res.status.firstCall.args[0]).to.equal(404);
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0].message).to.equal("Shortcode not found");
    });

    it("should return status 200 when shortcode is found", async function () {
      const shortcode = faker.random.alphaNumeric(6);

      let redirectReq = { params: { shortcode } },
        createReq = { body: { longUrl: faker.internet.url(), urlCode: shortcode } };

      UrlController.createShortUrl(createReq, res);
      UrlController.redirectToLongUrl(redirectReq, res);

      expect(res.status.called).to.be.true;
      expect(res.status.secondCall.args[0]).to.equal(200);
    });

  });

  describe("getShortCodeStats", function () {
    let status, json, res;

    beforeEach(() => {
      status = sinon.stub();
      json = sinon.spy();
      res = { json, status };
      status.returns(res);
      shortcode = faker.random.alphaNumeric(6);
      createReq = { body: { longUrl: faker.internet.url(), urlCode: shortcode } };
      UrlController.createShortUrl(createReq, res);
    });

    it("should return status 404 if shortcode is not provided", async function () {
      let req = { params: { shortcode: '' } };

      UrlController.getShortCodeStats(req, res);

      expect(res.status.calledTwice).to.be.true;
      expect(res.status.lastCall.args[0]).to.equal(404);
      expect(res.json.calledTwice).to.be.true;
      expect(res.json.lastCall.args[0].message).to.equal("Shortcode not found");
    });


    it("should return status 200 when shortcode is provided", async function () {
      let req = { params: { shortcode } };

      UrlController.getShortCodeStats(req, res);

      expect(res.status.calledTwice).be.true;
      expect(res.status.lastCall.args[0]).to.equal(200);
      expect(res.json.calledTwice).to.be.true;
      expect(res.json.lastCall.args[0].message).to.equal("shortcode stats successfully fetched");
    });
  });

});