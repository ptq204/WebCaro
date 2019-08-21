var express = require('express');
var router = express.Router();
var userService = require('../service/UserService');


router.get("/history", (req,res) => {
  let callback = (params) => {

  };
  user = {};
  user.username = req.body.usrId
  userService.getGameHistory ()
});

module.exports = router;