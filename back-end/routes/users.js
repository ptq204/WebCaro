var express = require('express');
var router = express.Router();
var userService = require('../service/UserService');


router.get("/history", (req,res) => {
  let callback = (params) => {
    if (params === "Invalid"){
      res.json({
        status: 100
      });
    } else {
      res.json(params);
    }
  };
  user = {};
  user.username = req.body.usrId;
  userService.getGameHistory (usrId, callback)
});

module.exports = router;