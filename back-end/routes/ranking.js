const express = require('express');
const router = express.Router();
const rankingService = require('../service/RankingService');

router.get("/ranking", (req,res) => {
    let callback = (top) => {

        let msgBody = {};
        for (let i = 0; i < top.length-1; i+=2){
            msgBody[top[i]] = Number(top[i+1]);
        }
        console.log(msgBody);
        res.json(msgBody);
    };
    rankingService.getCurrentTop(callback);
});

module.exports = router;
