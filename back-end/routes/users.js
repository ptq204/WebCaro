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
  userService.getGameHistory (req.usrId, callback);
});

router.get("/info", (req,res) => {
  let callback = (params) => {
    console.log(params);
    body = {
      username: params.username,
      win: params.win,
      loss: params.loss,
      rank: params.rank
    };
    res.json(body);
  };
  console.log(req.body.usrId);
  userService.getUser(req.body.usrId, callback);
});

module.exports = router;