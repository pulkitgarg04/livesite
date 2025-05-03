"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CodeEditor } from "@/components/code-editor"
import { createSite, checkSlugAvailability } from "@/lib/actions"
import { toast, Toaster } from "react-hot-toast"

export default function CreateSitePage() {
    const router = useRouter()
    const { user } = useUser()

    const [title, setTitle] = useState("")
    const [slug, setSlug] = useState("")
    const [description, setDescription] = useState("")
    const [html, setHtml] = useState("<h1>Hello World</h1>")
    const [css, setCss] = useState("h1 { color: purple; }")
    const [js, setJs] = useState("console.log('Hello from LiveSite!');")

    const [slugError, setSlugError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isCheckingSlug, setIsCheckingSlug] = useState(false)

    const handleSlugChange = async (value: string) => {
        const formatted = value.toLowerCase().replace(/[^a-z0-9-]/g, "-")
        setSlug(formatted)

        if (formatted.length < 3) {
            setSlugError("Slug must be at least 3 characters")
            return
        }

        setIsCheckingSlug(true)
        setSlugError("")

        try {
            const isAvailable = await checkSlugAvailability(formatted)
            if (!isAvailable) {
                setSlugError("This slug is already taken")
            }
        } catch (error) {
            console.error("Error checking slug:", error)
        } finally {
            setIsCheckingSlug(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user) {
            toast.error("You must be logged in to create a site")
            return
        }

        if (slugError) {
            toast.error(slugError)
            return
        }

        if (!title || !slug || !html) {
            toast.error("Please fill in all required fields")
            return
        }

        setIsSubmitting(true)

        try {
            await createSite({
                userId: user.id,
                title,
                slug,
                description,
                html,
                css,
                js,
            })

            toast.success("Your site has been created successfully")
            router.push("/dashboard")
        } catch (error) {
            console.error("Error creating site:", error)
            toast.error("Failed to create site. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container py-10">
            <h1 className="mb-8 text-3xl font-bold">Create New Site</h1>

            <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Site Details</CardTitle>
                            <CardDescription>Enter the basic information for your new site.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Site Title</Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="My Awesome Site"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">
                                        Slug
                                        {isCheckingSlug && <Loader2 className="ml-2 inline h-4 w-4 animate-spin" />}
                                    </Label>
                                    <div className="flex items-center">
                                        <Input
                                            id="slug"
                                            value={slug}
                                            onChange={(e) => handleSlugChange(e.target.value)}
                                            placeholder="my-awesome-site"
                                            required
                                            className={slugError ? "border-red-500" : ""}
                                        />
                                    </div>
                                    {slugError ? (
                                        <p className="text-sm text-red-500">{slugError}</p>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            Your site will be available at {slug || "your-slug"}.livesite.com
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description (Optional)</Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="A brief description of your site"
                                        rows={3}
                                    />
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>HTML</CardTitle>
                            <CardDescription>Write the HTML code for your site.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CodeEditor value={html} onChange={setHtml} language="html" height="200px" />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>CSS</CardTitle>
                            <CardDescription>Style your site with CSS.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CodeEditor value={css} onChange={setCss} language="css" height="200px" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>JavaScript</CardTitle>
                            <CardDescription>Add interactivity with JavaScript.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CodeEditor value={js} onChange={setJs} language="javascript" height="200px" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Preview</CardTitle>
                            <CardDescription>See how your site will look.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] overflow-hidden rounded border">
                                <iframe
                                    title="Site Preview"
                                    srcDoc={`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <style>${css}</style>
                      </head>
                      <body>
                        ${html}
                        <script>${js}</script>
                      </body>
                    </html>
                  `}
                                    className="h-full w-full"
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !!slugError}
                                className="w-full bg-purple-600 hover:bg-purple-700"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Site"
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}