import { NextResponse } from "next/server";
import { getSiteById } from "@/lib/mongodb";

export async function GET(request: Request) {
    const url = new URL(request.url);

    const id = url.searchParams.get('id');

    if (!id) {
        return NextResponse.json(
            { error: "Id parameter is required" },
            { status: 400 }
        );
    }

    try {
        const site = await getSiteById(id);

        if (!site) {
            return NextResponse.json(
                { error: "Site not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(site, { status: 200 });
    } catch (error) {
        console.error("Error fetching site:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}