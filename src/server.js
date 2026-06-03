const http = require("http");
const app = require("./app");
const env = require("./config/env");
const logger = require("./config/logger");

const server = http.createServer(app);

server.listen(env.PORT, () => {
  logger.info(`Server running on port ${env.PORT}`);
});

process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});
