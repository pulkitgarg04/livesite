"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { Site } from "./mongodb"

if (!process.env.MONGODB_URI) {
    throw new Error("Please add your MongoDB URI to .env.local");
  }
  const uri = process.env.MONGODB_URI;
  const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
};

interface SiteData {
    userId: string;
    title: string;
    slug: string;
    description?: string;
    html?: string;
    css?: string;
    js?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export async function createSite(data: SiteData) {
  await connectToDatabase();

  const site = new Site({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const result = await site.save();

  revalidatePath("/dashboard");
  return result;
}

export async function updateSite(id: string, data: Partial<SiteData>) {
  await connectToDatabase();

  const result = await Site.findByIdAndUpdate(
    id,
    { ...data, updatedAt: new Date() },
    { new: true }
  );

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/edit/${id}`);
  return result;
}

export async function deleteSite(id: string) {
  await connectToDatabase();

  const result = await Site.findByIdAndDelete(id);

  revalidatePath("/dashboard");
  return result;
}

export async function checkSlugAvailability(slug: string) {
  await connectToDatabase();

  const existingSite = await Site.findOne({ slug });
  return !existingSite;
}