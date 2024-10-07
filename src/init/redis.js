import Redis from "ioredis";

const redisClient = new Redis({
    host: 'localhost',
    port: 6379
});

redisClient.on('error', (err) => {
    console.log('Redis client error: ', err);
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

export default redisClient;