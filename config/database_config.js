require("dotenv").config().parsed;
module.exports = {
  development: {
    username: process.env.DEV_PG_USERNAME,
    password: process.env.DEV_PG_PASSWORD,
    database: process.env.DEV_PG_DATABASE,
    host: process.env.DEV_PG_HOST,
    port: process.env.DEV_PG_PORT,
    dialect: "postgres",
  },

  production: {
    // use_env_variable: process.env.DATABASE_URL,
    username: process.env.PROD_PG_USERNAME,
    password: process.env.PROD_PG_PASSWORD,
    database: process.env.PROD_PG_DATABASE,
    host: process.env.PROD_PG_HOST,
    port: process.env.PROD_PG_PORT,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};

