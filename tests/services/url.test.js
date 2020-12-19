require('dotenv').config()
const chai = require("chai");
const expect = chai.expect;
const faker = require("faker");
let UrlModel = [];

describe("UrlService", function () {
  let baseUrl = process.env.baseURL;
  let urlCode = faker.random.alphaNumeric(6)
  const UrlModelLength = UrlModel.length;

  const stubValue = {
    longUrl: faker.internet.url(),
    shortUrl: baseUrl + urlCode,
    urlCode,
    clickCount: 0,
    createdAt: faker.date.past(),
    lastVisitedAt: null
  };

  describe("create shortened url", function () {
    it("should add a new shortened url to the store", async function () {
      UrlModel.push({ ...stubValue });

      expect(UrlModel.length).to.greaterThan(UrlModelLength);
      expect(UrlModel[0].longUrl).to.equal(stubValue.longUrl);
      expect(UrlModel[0].shortUrl).to.equal(stubValue.shortUrl);
      expect(UrlModel[0].urlCode).to.equal(stubValue.urlCode);
    });
  });

  describe("redirect to long url", function () {
    it("should find and return the correct long Url", async function () {

      let url = UrlModel.find(url => url.urlCode === stubValue.urlCode);

      expect(url).to.not.be.undefined;
      expect(url.longUrl).to.equal(stubValue.longUrl);
    });

    it("should increment clickCount and have value for lastVisitedAt", async function () {

      let url = UrlModel.find(url => url.urlCode === stubValue.urlCode);
      url.clickCount++;
      url.lastVisitedAt = Date.now();

      expect(url.clickCount).to.greaterThan(stubValue.clickCount);
      expect(url.lastVisitedAt).to.not.be.null;
    });

  });
});