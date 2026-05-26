import mongoose from "mongoose";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { app } from "./app";
import { env } from "./config/env";

async function startServer() {
  if (process.env.DEBUG_STARTUP === "true") {
    console.log("DEBUG_STARTUP", {
      cwd: process.cwd(),
      SKIP_DB: process.env.SKIP_DB,
      skipDb: env.skipDb,
      mongoUriPresent: Boolean(env.mongoUri),
    });
  }

  if (!env.skipDb && !env.mongoUri) {
    const apiEnvPath = fileURLToPath(new URL("../.env", import.meta.url));
    const apiEnvExists = existsSync(apiEnvPath);

    throw new Error(
      `MONGODB_URI is required. ${apiEnvExists ? `Set it in ${apiEnvPath}` : `Create ${apiEnvPath} (copy from .env.example) and set MONGODB_URI`}`,
    );
  }

  if (!env.skipDb) {
    try {
      await mongoose.connect(env.mongoUri, {
        serverSelectionTimeoutMS: 5_000,
      });
    } catch (error) {
      console.error("Failed to connect to MongoDB.");
      console.error("Check that MongoDB is running locally or update MONGODB_URI in backend/.env");
      console.error(
        "If you just want the API to boot for preview, set SKIP_DB=true in backend/.env",
      );
      throw error;
    }
  }

  app.listen(env.port, () => {
    console.log(`API listening on port ${env.port}`);
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
