require('dotenv').config()
const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const faker = require("faker");
const UrlModel = require("../../models/UrlStore.json").data;
const UrlService = require("../../services/Url");

describe("UrlService", function () {
  let baseUrl = process.env.baseURL;
  let urlCode = faker.random.uuid()

  const stubValue = {
    longUrl: faker.internet.url(),
    shortUrl: baseUrl + urlCode,
    urlCode,
    clickCount: faker.random.number(),
    createdAt: faker.date.past(),
    lastVisitedAt: faker.date.recent()
  };
  describe("create shortened url", function () {
    it("should add a new shortened url to the store", async function () {

      const UrlModelLength = UrlModel.length;

      UrlModel.push({ ...stubValue });

      expect(UrlModel.length).to.greaterThan(UrlModelLength);
      expect(UrlModel[0].longUrl).to.equal(stubValue.longUrl);
      expect(UrlModel[0].shortUrl).to.equal(stubValue.shortUrl);
      expect(UrlModel[0].urlCode).to.equal(stubValue.urlCode);
    });
  });

  describe("create shortened url", function () {
    it("should add a new shortened url to the store", async function () {

      const UrlModelLength = UrlModel.length;

      UrlModel.push({ ...stubValue });

      expect(UrlModel.length).to.greaterThan(UrlModelLength);
      expect(UrlModel[0].longUrl).to.equal(stubValue.longUrl);
      expect(UrlModel[0].shortUrl).to.equal(stubValue.shortUrl);
      expect(UrlModel[0].urlCode).to.equal(stubValue.urlCode);
    });
  });

});