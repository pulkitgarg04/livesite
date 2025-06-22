"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Loader2, ArrowLeft, Eye, Code, Palette } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeEditor } from "@/components/code-editor"
import { createSite, checkSlugAvailability } from "@/lib/actions"
import { toast, Toaster } from "react-hot-toast"
import Link from "next/link"

export default function CreateSitePage() {
  const router = useRouter()
  const { user } = useUser()

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [html, setHtml] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Awesome Site</title>
</head>
<body>
    <h1>Welcome to My Site</h1>
    <p>This is a sample paragraph.</p>
</body>
</html>`)
  const [css, setCss] = useState(`body {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

h1 {
    color: #cff245;
    text-align: center;
}

p {
    line-height: 1.6;
    text-align: center;
}`)
  const [js, setJs] = useState(`console.log('Welcome to LiveSite!');

// Add some interactivity
document.addEventListener('DOMContentLoaded', function() {
    const h1 = document.querySelector('h1');
    if (h1) {
        h1.addEventListener('click', function() {
            this.style.transform = this.style.transform === 'scale(1.1)' ? 'scale(1)' : 'scale(1.1)';
        });
    }
});`)

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
    <div className="min-h-screen bg-[#0d0e11] text-white">
      <Toaster />

      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="text-gray-400 hover:text-black">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Create New Site</h1>
              <p className="text-gray-400 text-sm">Deploy your HTML, CSS, and JavaScript project</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Code className="h-5 w-5 text-[#cff245]" />
                  Site Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white mb-4">
                    Site Title *
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="My Awesome Site"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="slug" className="text-white mb-4">
                    URL Slug * {isCheckingSlug && <Loader2 className="inline h-4 w-4 animate-spin ml-2" />}
                  </Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="my-awesome-site"
                    className={`bg-gray-800 border-gray-700 text-white ${slugError ? "border-red-500" : ""}`}
                  />
                  {slugError ? (
                    <p className="text-red-400 text-sm mt-1">{slugError}</p>
                  ) : (
                    <p className="text-gray-400 text-sm mt-1">yourlivesite.vercel.app/s/{slug || "your-slug"}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description" className="text-white mb-4">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A brief description of your site"
                    className="bg-gray-800 border-gray-700 text-white"
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !!slugError}
                  className="w-full bg-[#cff245] hover:bg-[#b8e03a] text-black font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Site...
                    </>
                  ) : (
                    "Create Site"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Palette className="h-5 w-5 text-[#cff245]" />
                  Code Editor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="html" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                    <TabsTrigger
                      value="html"
                      className="text-white data-[state=active]:bg-[#cff245] data-[state=active]:text-black data-[state=inactive]:text-white"
                    >
                      HTML
                    </TabsTrigger>
                    <TabsTrigger
                      value="css"
                      className="text-white data-[state=active]:bg-[#cff245] data-[state=active]:text-black data-[state=inactive]:text-white"
                    >
                      CSS
                    </TabsTrigger>
                    <TabsTrigger value="js" className="text-white data-[state=active]:bg-[#cff245] data-[state=active]:text-black data-[state=inactive]:text-white">
                      JavaScript
                    </TabsTrigger>
                    <TabsTrigger
                      value="preview"
                      className="text-white data-[state=active]:bg-[#cff245] data-[state=active]:text-black data-[state=inactive]:text-white"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="html" className="mt-4">
                    <div className="border border-gray-700 rounded-lg overflow-hidden">
                      <CodeEditor value={html} onChange={setHtml} language="html" />
                    </div>
                  </TabsContent>

                  <TabsContent value="css" className="mt-4">
                    <div className="border border-gray-700 rounded-lg overflow-hidden">
                      <CodeEditor value={css} onChange={setCss} language="css" />
                    </div>
                  </TabsContent>

                  <TabsContent value="js" className="mt-4">
                    <div className="border border-gray-700 rounded-lg overflow-hidden">
                      <CodeEditor value={js} onChange={setJs} language="javascript" />
                    </div>
                  </TabsContent>

                  <TabsContent value="preview" className="mt-4">
                    <div className="border border-gray-700 rounded-lg overflow-hidden">
                      <iframe
                        title="Site Preview"
                        srcDoc={`<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}<script>${js}</script></body></html>`}
                        className="w-full h-[500px] bg-white"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}