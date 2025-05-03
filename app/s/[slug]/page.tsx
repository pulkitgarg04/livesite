"use client"

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function SitePage() {
    const { slug } = useParams();
    const [siteData, setSiteData] = useState(null);

    useEffect(() => {
        if (slug) {
            fetch(`/api/sites/${slug}`)
                .then((response) => response.json())
                .then((data) => setSiteData(data))
                .catch((error) => console.error('Error fetching site data:', error));
        }
    }, [slug]);

    if (!siteData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container py-10">
            <h1 className="text-4xl font-semibold text-indigo-400">{siteData.title}</h1>
            <iframe
                title="Site Preview"
                srcDoc={`<!DOCTYPE html><html><head><style>${siteData.css}</style></head><body>${siteData.html}<script>${siteData.js}</script></body></html>`}
                className="w-full h-[400px] border border-gray-700"
            />
        </div>
    );
}