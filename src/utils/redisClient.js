import Redis from "ioredis";
import dotenv from "dotenv"

dotenv.config();

const redisClient= new Redis({
host: process.env.REDIS_HOST,
port: process.env.REDIS_PORT
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('ready', () => console.log('Redis Client Ready'));

export default redisClient;