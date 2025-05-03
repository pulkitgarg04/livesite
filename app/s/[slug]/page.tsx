"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

type SiteData = {
    title: string;
    html: string;
    css: string;
    js: string;
    description: string;
};

const SitePage = () => {
    const { slug: rawSlug } = useParams();
    const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
    const [siteData, setSiteData] = useState<SiteData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            fetch(`/api/site?slug=${encodeURIComponent(slug)}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch site data");
                    }
                    return response.json();
                })
                .then((data) => {
                    setSiteData(data);
                    setIsLoading(false);

                    if (data.title) {
                        document.title = data.title;
                    }
                })
                .catch((error) => {
                    console.error("Error fetching site data:", error);
                    setIsLoading(false);
                });
        }
    }, [slug]);

    if (isLoading) {
        return <div className="w-screen h-screen flex justify-center items-center">
            <Loader2 className="inline h-10 w-10 animate-spin" />
        </div>
    }

    if (!siteData) {
        return <div className="text-center py-10 text-red-500">Site not found!</div>;
    }

    return (
        <div className="w-screen h-screen">
            <iframe
                title={siteData.title}
                srcDoc={`<!DOCTYPE html>
        <html lang="en">
          <head>
            <style>${siteData.css}</style>
          </head>
          <body>${siteData.html}<script>${siteData.js}</script></body>
        </html>`}
                className="w-full h-full border-none"
            />
        </div>
    );
};

export default SitePage;