import Link from "next/link"
import { ArrowRight, Code2, Globe, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur flex justify-center">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-purple-500" />
            <span className="text-xl font-bold">LiveSite</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:underline">
              Login
            </Link>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center">
        <section className="container py-24 md:py-32">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Deploy your <span className="text-purple-500">static sites</span> in seconds
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              LiveSite helps you deploy HTML, CSS, and JavaScript single-page websites instantly with custom domains.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Link href="/signup">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Login to Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container py-16 md:py-24">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center rounded-lg border p-6 text-center shadow-sm">
              <div className="rounded-full bg-purple-100 p-3">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mt-4 text-xl font-bold">Instant Deployment</h3>
              <p className="mt-2 text-muted-foreground">Deploy your site in seconds with our streamlined workflow.</p>
            </div>
            <div className="flex flex-col items-center rounded-lg border p-6 text-center shadow-sm">
              <div className="rounded-full bg-green-100 p-3">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-xl font-bold">Custom Slug</h3>
              <p className="mt-2 text-muted-foreground">Use your own slug for your LiveSite.</p>
            </div>
            <div className="flex flex-col items-center rounded-lg border p-6 text-center shadow-sm">
              <div className="rounded-full bg-amber-100 p-3">
                <Code2 className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="mt-4 text-xl font-bold">Code Editor</h3>
              <p className="mt-2 text-muted-foreground">Built-in code editor for HTML, CSS, and JavaScript.</p>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 px-16 my-5 md:py-24 rounded-2xl">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to bring your ideas to life?</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join thousands of developers who trust LiveSite for their static site hosting needs.
              </p>
              <Button asChild size="lg" className="mt-8 bg-purple-600 hover:bg-purple-700">
                <Link href="/signup">Create Your First Site</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-8 flex justify-center">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-purple-500" />
            <span className="font-semibold">LiveSite</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} LiveSite. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
