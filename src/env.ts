import dotenv from 'dotenv';
dotenv.config();

export const { NODE_ENV = 'development' } = process.env;
