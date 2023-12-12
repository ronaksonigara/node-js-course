const express = require("express");

const { getLogin } = require("../controllers/auth");

const router = express.Router();

router.get("/login", getLogin);

// router.post("/login", authController.postLogin);

// router.post("/logout", authController.postLogout);

module.exports = router;
