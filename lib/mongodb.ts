import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}
const uri = process.env.MONGODB_URI;

async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(uri);
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
      throw err;
    }
  }
}

const SiteSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    html: { type: String },
    css: { type: String },
    js: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
export const Site = mongoose.models.Site || mongoose.model("Site", SiteSchema);

export async function getSitesByUserId(userId: string) {
  await connectToDatabase();
  return Site.find({ userId }).sort({ createdAt: -1 }).exec();
}

export async function getSiteBySlug(slug: string) {
  await connectToDatabase();
  return Site.findOne({ slug }).exec();
}

export async function getSiteById(id: string) {
  await connectToDatabase();
  return Site.findById(id).exec();
}

export async function isSlugAvailable(slug: string) {
  await connectToDatabase();
  const existingSite = await Site.findOne({ slug }).exec();
  return !existingSite;
}

export default connectToDatabase;