import dotenv from "dotenv";
import path from "path";

const appDir = path.join(process.cwd(), ".env");

dotenv.config({ path: appDir });

export default {
  port: process.env.PORT,
  node_env: process.env.NODE_ENV,
  database_url: process.env.DATABASE_URL,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires: process.env.JWT_ACCESS_EXPIRES,
};
