const express = require("express");
const router = express.Router();
const {
  register,
  login,
  profile,
  wishlist,
  transaction,
} = require("../controllers/userControllers");
const verify_token= require('../middleware/verification')

    
router.post("/register", register);
router.get("/login", login);
router.get("/profile", verify_token, profile);
router.get("/wishlist", verify_token, wishlist);

router.get("/transaction", verify_token, transaction);

module.exports = router;
