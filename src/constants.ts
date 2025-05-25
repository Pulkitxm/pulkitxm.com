import dotenv from "dotenv";
dotenv.config();

export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") || [];
export const PORT = process.env.PORT || 8000;
export const IP_SALT = process.env.IP_SALT || "default-salt";
