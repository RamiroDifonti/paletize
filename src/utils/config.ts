import dotenv from 'dotenv';
dotenv.config();

export const {
    PORT = 5000,
    MONGO_URI = "undefined",
    JWT_SECRET
} = process.env

export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;
