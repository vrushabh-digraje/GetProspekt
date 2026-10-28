import mongoose from "mongoose";
import Resource from "./models/Resource.js";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// Read initialDemoResources from frontend api.ts
const apiFile = fs.readFileSync("F:/publication-website/frontend/src/services/api.ts", "utf-8");

const start = apiFile.indexOf("export const initialDemoResources = [");
const end = apiFile.indexOf("export const resourcesApi", start);
const block = apiFile.substring(start, end);

// Extract all objects from initialDemoResources
const idMatches = [...block.matchAll(/_id:\s*["']([^"']+)["']/g)].map(m => m[1]);
const titleMatches = [...block.matchAll(/title:\s*["']([^"']+)["']/g)].map(m => m[1]);
const imgMatches = [...block.matchAll(/coverImage:\s*["']([^"']+)["']/g)].map(m => m[1]);
const typeMatches = [...block.matchAll(/type:\s*["']([^"']+)["']/g)].map(m => m[1]);
const catMatches = [...block.matchAll(/category:\s*["']([^"']+)["']/g)].map(m => m[1]);

console.log(`Parsed ${idMatches.length} items from frontend api.ts`);

const updateDb = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    console.log("Connecting to:", mongoUri ? mongoUri.split('@')[1] : "No URI");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB Atlas!");

    // Delete old placeholder resources or update them
    for (let i = 0; i < idMatches.length; i++) {
      const _id = idMatches[i];
      const title = titleMatches[i];
      const coverImage = imgMatches[i];
      const type = typeMatches[i] || "Whitepaper";
      const category = catMatches[i] || "Enterprise Technology";

      await Resource.findOneAndUpdate(
        { title: title },
        { 
          title, 
          coverImage, 
          type, 
          category,
          status: "Published" 
        },
        { upsert: true, new: true }
      );
    }

    const count = await Resource.countDocuments();
    console.log(`Successfully synced MongoDB Atlas resources! Total documents in DB: ${count}`);
    process.exit(0);
  } catch (err) {
    console.error("MongoDB update error:", err);
    process.exit(1);
  }
};

updateDb();
