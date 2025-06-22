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

// Site Schema
const SiteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  html: { type: String },
  css: { type: String },
  js: { type: String },
  views: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["active", "inactive", "draft"],
    default: "active",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Site Visit Schema (for tracking individual visits)
const SiteVisitSchema = new mongoose.Schema({
  siteId: { type: mongoose.Schema.Types.ObjectId, ref: "Site", required: true },
  userId: { type: String, required: true },
  visitorId: { type: String }, // anonymous visitor ID
  ipAddress: { type: String },
  userAgent: { type: String },
  referrer: { type: String },
  country: { type: String },
  device: { type: String }, // desktop, mobile, tablet
  sessionDuration: { type: Number, default: 0 }, // in seconds
  visitedAt: { type: Date, default: Date.now },
});

export const Site = mongoose.models.Site || mongoose.model("Site", SiteSchema);
export const SiteVisit =
  mongoose.models.SiteVisit || mongoose.model("SiteVisit", SiteVisitSchema);

// Site functions
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

export async function createSite(siteData: {
  userId: string;
  title: string;
  slug: string;
  description?: string;
  html: string;
  css?: string;
  js?: string;
}) {
  await connectToDatabase();
  const site = new Site(siteData);
  return site.save();
}

export async function updateSite(
  id: string,
  updateData: Partial<{
    title: string;
    slug: string;
    description: string;
    html: string;
    css: string;
    js: string;
    status: string;
  }>
) {
  await connectToDatabase();
  return Site.findByIdAndUpdate(
    id,
    { ...updateData, updatedAt: new Date() },
    { new: true }
  ).exec();
}

export async function deleteSite(id: string) {
  await connectToDatabase();
  return Site.findByIdAndDelete(id).exec();
}

export async function incrementSiteViews(siteId: string) {
  await connectToDatabase();
  return Site.findByIdAndUpdate(
    siteId,
    { $inc: { views: 1 } },
    { new: true }
  ).exec();
}

// Site Visit functions
export async function recordSiteVisit(visitData: {
  siteId: string;
  userId: string;
  visitorId?: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  country?: string;
  device?: string;
}) {
  await connectToDatabase();

  try {
    const visit = new SiteVisit({
      ...visitData,
      siteId: new mongoose.Types.ObjectId(visitData.siteId),
    });

    console.log("Recording visit:", visit);
    const savedVisit = await visit.save();
    console.log("Visit saved successfully:", savedVisit._id);

    return savedVisit;
  } catch (error) {
    console.error("Error recording visit:", error);
    throw error;
  }
}

export async function getSiteVisits(
  siteId: string,
  startDate?: Date,
  endDate?: Date
) {
  await connectToDatabase();

  try {
    const query: Record<string, unknown> = {
      siteId: new mongoose.Types.ObjectId(siteId),
    };
    if (!siteId) {
      throw new Error("Site ID is required to fetch visits");
    }
    if (startDate && endDate) {
      query.visitedAt = { $gte: startDate, $lte: endDate };
    }

    console.log("MongoDB query for visits:", query);
    const visits = await SiteVisit.find(query).sort({ visitedAt: -1 }).exec();
    console.log(`MongoDB returned ${visits.length} visits`);

    return visits;
  } catch (error) {
    console.error("Error in getSiteVisits:", error);
    return [];
  }
}

export async function getUniqueVisitorsCount(
  siteId: string,
  startDate?: Date,
  endDate?: Date
) {
  await connectToDatabase();
  const query: Record<string, unknown> = { siteId };
  if (!siteId) {
    throw new Error("Site ID is required to fetch unique visitors");
  }
  if (startDate && endDate) {
    query.visitedAt = { $gte: startDate, $lte: endDate };
  }

  return SiteVisit.distinct("visitorId", query).exec();
}

export default connectToDatabase;
