"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CodeEditor } from "@/components/code-editor";
import { createSite, checkSlugAvailability } from "@/lib/actions";
import { toast, Toaster } from "react-hot-toast";

export default function CreateSitePage() {
    const router = useRouter();
    const { user } = useUser();

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [html, setHtml] = useState("<h1>Hello World</h1>");
    const [css, setCss] = useState("h1 { color: purple; }");
    const [js, setJs] = useState("console.log('Hello from LiveSite!');");

    const [slugError, setSlugError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCheckingSlug, setIsCheckingSlug] = useState(false);

    const handleSlugChange = async (value: string) => {
        const formatted = value.toLowerCase().replace(/[^a-z0-9-]/g, "-");
        setSlug(formatted);

        if (formatted.length < 3) {
            setSlugError("Slug must be at least 3 characters");
            return;
        }

        setIsCheckingSlug(true);
        setSlugError("");

        try {
            const isAvailable = await checkSlugAvailability(formatted);
            if (!isAvailable) {
                setSlugError("This slug is already taken");
            }
        } catch (error) {
            console.error("Error checking slug:", error);
        } finally {
            setIsCheckingSlug(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error("You must be logged in to create a site");
            return;
        }

        if (slugError) {
            toast.error(slugError);
            return;
        }

        if (!title || !slug || !html) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);

        try {
            await createSite({
                userId: user.id,
                title,
                slug,
                description,
                html,
                css,
                js,
            });

            toast.success("Your site has been created successfully");
            router.push("/dashboard");
        } catch (error) {
            console.error("Error creating site:", error);
            toast.error("Failed to create site. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container py-10">
            <Toaster />
            <h1 className="mb-8 text-3xl font-bold">Create New Site</h1>

            <div className="mb-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Site Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="title" className="mb-2">Site Title</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="My Awesome Site"
                                />
                            </div>
                            <div>
                                <Label htmlFor="slug" className="mb-2">
                                    Slug {isCheckingSlug && <Loader2 className="inline h-4 w-4 animate-spin" />}
                                </Label>
                                <Input
                                    id="slug"
                                    value={slug}
                                    onChange={(e) => handleSlugChange(e.target.value)}
                                    placeholder="my-awesome-site"
                                    className={slugError ? "border-red-500" : ""}
                                />
                                {slugError ? (
                                    <p className="text-red-500 text-sm">{slugError}</p>
                                ) : (
                                    <p className="text-sm">Your site will be available at yourlivesite.vercel.app/s/{slug || "your-slug"}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="description" className="mb-2">Description</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="A brief description of your site"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mb-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Code Editors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                            <div>
                                <Label>HTML</Label>
                                <CodeEditor value={html} onChange={setHtml} language="html" />
                            </div>
                            <div>
                                <Label>CSS</Label>
                                <CodeEditor value={css} onChange={setCss} language="css" />
                            </div>
                            <div>
                                <Label>JavaScript</Label>
                                <CodeEditor value={js} onChange={setJs} language="javascript" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <iframe
                            title="Site Preview"
                            srcDoc={`<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}<script>${js}</script></body></html>`}
                            className="w-full h-[400px] border"
                        />
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !!slugError}
                            className="w-full"
                        >
                            {isSubmitting ? "Creating..." : "Create Site"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}