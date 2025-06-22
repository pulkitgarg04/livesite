"use client";

import Link from "next/link";
import { useState } from "react";
import { Edit, ExternalLink, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteSite } from "@/lib/actions";

interface SiteCardProps {
  site: {
    _id: string;
    slug: string;
    title: string;
    description: string;
    createdAt: Date;
  };
}

export function SiteCard({ site }: SiteCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSite(site._id.toString());
    } catch (error) {
      console.error("Failed to delete site:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center justify-between text-white">
          {site.title}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-8 w-8 text-muted-foreground truncate overflow-hidden flex items-center justify-center"
          >
            <Link
              href={`https://yourlivesite.vercel.app/s/${site.slug}`}
              target="_blank"
              className="truncate flex items-center bg-transparent hover:bg-gray-800 rounded-md p-1 text-gray-400 hover:text-white transition-colors"
            >
              <ExternalLink className="h-4 w-4 flex-shrink-0" />
              <span className="sr-only">Visit site</span>
            </Link>
          </Button>
        </CardTitle>
        <CardDescription className="text-gray-400">
          {site.description || "No description"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="rounded-md bg-slate-100 px-3 py-1 text-sm font-mono truncate text-gray-800 dark:bg-slate-800 dark:text-gray-200">
          https://yourlivesite.vercel.app/s/{site.slug}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild variant="outline" size="sm">
          <Link href={`/dashboard/edit/${site._id}`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={isDeleting}>
              <Trash className="mr-2 h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                site and remove the data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
