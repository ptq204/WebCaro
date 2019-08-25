let client;

module.exports = {
    getCurrentTop: (callback) => {
        client.zrange('ranking',0,99,"withscores", (err, reply) => {
            if (err) return handleError(err);
            callback(reply); 
        });
    },
    setRedisClient: (inClient) => {
        client = inClient;
    }
};
