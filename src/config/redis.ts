import { createClient } from 'redis';

const client = createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`,
  password: process.env.REDIS_PASSWORD || undefined,
});

client.on('error', (err) => console.log('Redis Client Error', err));

let isConnected = false;

export const connectRedis = async () => {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
    console.log('Connected to Redis');
  }
};

export const setOTP = async (key: string, otp: string, expireInSeconds: number = 1800) => {
  if (!isConnected) await connectRedis();
  await client.setEx(key, expireInSeconds, otp);
  console.log(`Redis SET: ${key} = ${otp}`);
};

export const getOTP = async (key: string): Promise<string | null> => {
  if (!isConnected) await connectRedis();
  const value = await client.get(key);
  console.log(`Redis GET: ${key} = ${value}`);
  return value;
};

export const deleteOTP = async (key: string) => {
  if (!isConnected) await connectRedis();
  await client.del(key);
  console.log(`Redis DELETE: ${key}`);
};

export default client;