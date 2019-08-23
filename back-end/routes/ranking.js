const express = require('express');
const router = express.Router();
const rankingService = require('../service/RankingService');

router.get("/ranking", (req,res) => {
    let callback = (top) => {
        res.json(top);
    };
    rankingService.getCurrentTop(callback);
});

module.exports = router;