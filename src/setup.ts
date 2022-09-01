import dotenv from "dotenv";

const path = process.env.NODE_ENV === "production" ? ".env" : ".env.dev";

dotenv.config({ path });
