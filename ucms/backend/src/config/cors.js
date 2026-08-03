import env from "./env.js";

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

export default corsOptions;
