let client;

module.exports = {
    getCurrentTop: () => {
        top100 = client.zrange('ranking',0,99,"withscores");
        return top100;
    },
    setRedisClient: (inClient) => {
        client = inClient;
    }
};
