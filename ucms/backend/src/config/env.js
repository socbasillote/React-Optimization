import dotenv from "dotenv";

dotenv.config();

console.log("Loaded MONGODB_URI:", process.env.MONGODB_URI);

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 5000,
  CLIENT_URL: process.env.CLIENT_URL,
  MONGODB_URI: process.env.MONGODB_URI,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN_DAYS: Number(
    process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS,
  ),
};

export default env;
