const express = require("express");
const controller = require("./controller");

const router = express.Router();

router
  .route("/api/v1/shortUrl")
  .get(controller.getShortUrl)
  .post(controller.createShortUrl);

module.exports = router;
