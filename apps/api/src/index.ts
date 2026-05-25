import mongoose from "mongoose";

import { app } from "./app";
import { env } from "./config/env";

async function startServer() {
  if (!env.mongoUri) {
    throw new Error("MONGODB_URI is required");
  }

  await mongoose.connect(env.mongoUri);

  app.listen(env.port, () => {
    console.log(`API listening on port ${env.port}`);
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
