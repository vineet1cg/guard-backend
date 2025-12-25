import mongoose from "mongoose";

/**
 * MongoDB Connection Handler
 * Hardened, fail-fast, production-safe
 */

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined");
    process.exit(1);
  }

  try {
    mongoose.set("strictQuery", true);

    const options = {
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45_000,
      serverSelectionTimeoutMS: 5_000,
      retryWrites: true,
      w: "majority",
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB connected`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   DB: ${conn.connection.name}`);

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected");
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

/* ------------------------------------------------------------------ */
/* Graceful Shutdown */
/* ------------------------------------------------------------------ */

const shutdown = async (signal) => {
  try {
    await mongoose.connection.close(false);
    console.log(`\n🛑 MongoDB disconnected on ${signal}`);
    process.exit(0);
  } catch {
    process.exit(1);
  }
};

["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
  process.on(signal, shutdown);
});

export default connectDB;
