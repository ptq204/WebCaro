var express = require('express');
var router = express.Router();
var userService = require('../service/UserService');

router.post("/login", (req,res) => {
    let callback = (params) => {
      let body = {};
      if (params === "Invalid"){
        body.status = 100;
      } else {
        body.status = 0;
        body.token = params;
      }
      res.json(body);
    };
    console.log(req.body);
    userService.authenticateUser(req.body, callback);
  });
  
router.post("/register", (req,res) => {
    let callback = (params) => {
        let body = {};
        if (params === "exist"){
        body.status = 100;
        } else {
        body.status = 0;
        body.token = params;
        }
        res.json(body);
    };
    console.log(req.body);
    userService.createUser(req.body, callback);
});



module.exports = router;