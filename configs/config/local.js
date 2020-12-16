require('dotenv').config()

let localConfig = {
  hostname: process.env.HOSTNAME,
  port: process.env.PORT
};

module.exports = localConfig;