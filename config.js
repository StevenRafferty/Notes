// Packages
const dotenv = require('dotenv');

// Initialize dotenv so we can get the enviroment variables from .env file
dotenv.config();

module.exports = {
  db: {
    url: process.env.DATABASE_URL,
  },
  express: {
    port: process.env.PORT || 8080,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  mail: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};
