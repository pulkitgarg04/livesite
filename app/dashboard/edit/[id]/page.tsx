"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ArrowLeft, Eye, Code, Palette, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeEditor } from "@/components/code-editor"
import { updateSite, checkSlugAvailability } from "@/lib/actions"
import { toast, Toaster } from "react-hot-toast"
import Link from "next/link"

interface SiteData {
  _id: string
  userId: string
  title: string
  slug: string
  description: string
  html: string
  css: string
  js: string
}

export default function EditSitePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()

  const [, setSite] = useState<SiteData | null>(null)
  const [id, setId] = useState<string | null>(null)

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [originalSlug, setOriginalSlug] = useState("")
  const [description, setDescription] = useState("")
  const [html, setHtml] = useState("")
  const [css, setCss] = useState("")
  const [js, setJs] = useState("")

  const [slugError, setSlugError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isCheckingSlug, setIsCheckingSlug] = useState(false)

  useEffect(() => {
    const unwrapParams = async () => {
      const { id: unwrappedId } = await params
      setId(unwrappedId)
    }

    unwrapParams()
  }, [params])

  useEffect(() => {
    if (!id) return

    const fetchSite = async () => {
      try {
        const response = await fetch(`/api/sites?id=${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch site")
        }

        const data = await response.json()
        setSite(JSON.parse(JSON.stringify(data)))
        setTitle(data.title)
        setSlug(data.slug)
        setOriginalSlug(data.slug)
        setDescription(data.description || "")
        setHtml(data.html)
        setCss(data.css)
        setJs(data.js)
      } catch (error) {
        console.error("Error fetching site:", error)
        toast.error("Failed to load site data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSite()
  }, [id])

  const handleSlugChange = async (value: string) => {
    const formatted = value.toLowerCase().replace(/[^a-z0-9-]/g, "-")
    setSlug(formatted)

    if (formatted.length < 3) {
      setSlugError("Slug must be at least 3 characters")
      return
    }

    if (formatted === originalSlug) {
      setSlugError("")
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
      if (id) {
        const updatedData = {
          title,
          slug,
          description,
          html,
          css,
          js,
        }

        await updateSite(id, updatedData)
        toast.success("Site updated successfully")
        router.push("/dashboard")
      } else {
        toast.error("Failed to update site due to invalid ID")
      }
    } catch (error) {
      console.error("Error updating site:", error)
      toast.error("Failed to update site. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || !id) {
    return (
      <div className="min-h-screen bg-[#0d0e11] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#cff245] mx-auto mb-4" />
          <p className="text-gray-400">Loading site data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d0e11] text-white">
      <Toaster />

      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="text-gray-400 hover:text-black">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Edit Site</h1>
                <p className="text-gray-400 text-sm">Update your site configuration and code</p>
              </div>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !!slugError}
              className="bg-[#cff245] hover:bg-[#b8e03a] text-black font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
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
                    <TabsTrigger
                      value="js"
                      className="text-white data-[state=active]:bg-[#cff245] data-[state=active]:text-black data-[state=inactive]:text-white"
                    >
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
                      <CodeEditor value={html} onChange={setHtml} language="html" height="600px" />
                    </div>
                  </TabsContent>

                  <TabsContent value="css" className="mt-4">
                    <div className="border border-gray-700 rounded-lg overflow-hidden">
                      <CodeEditor value={css} onChange={setCss} language="css" height="600px" />
                    </div>
                  </TabsContent>

                  <TabsContent value="js" className="mt-4">
                    <div className="border border-gray-700 rounded-lg overflow-hidden">
                      <CodeEditor value={js} onChange={setJs} language="javascript" height="600px" />
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