import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT || 3001,
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "20040830",
  DB_NAME: process.env.DB_NAME || "news_portal",
  DB_PORT: process.env.DB_PORT || 3306,
};

export { config };
