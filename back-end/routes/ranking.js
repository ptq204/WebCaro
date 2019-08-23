const express = require('express');
const router = express.Router();
const rankingService = require('../service/RankingService');

router.get("/ranking", (req,res) => {
    top100 = rankingService.getCurrentTop();
    res.json(top100);
});

module.exports = router;