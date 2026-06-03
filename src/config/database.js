const env = require("./env");

module.exports = {
  development: {
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: "mysql",
    logging: false,
  },
  test: {
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: `${env.DB_NAME}_test`,
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: "mysql",
    logging: false,
  },
  production: {
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
