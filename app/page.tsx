import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Code, FileCode, Globe } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Livesite
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl">
            Create, preview, and host your HTML, CSS, and JavaScript snippets with a unique URL in seconds
          </p>
          <div className="flex gap-4 mb-16">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/create">
                Create a Snippet <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:text-slate-800">
              <Link href="/dashboard">
                My Snippets <FileCode className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <Card className="bg-slate-800 border-slate-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Code className="h-5 w-5 text-blue-400" /> Code Editor
              </CardTitle>
              <CardDescription className="text-slate-300">
                Write HTML, CSS, and JavaScript in our feature-rich editor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                Our editors support syntax highlighting, auto-completion, and live error checking to make coding a breeze.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="h-5 w-5 text-emerald-400" /> Live Preview
              </CardTitle>
              <CardDescription className="text-slate-300">
                See your changes in real-time with our live preview feature
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                Instantly visualize your code output without leaving the editor, making it easy to iterate quickly.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileCode className="h-5 w-5 text-purple-400" /> Hosted Sites
              </CardTitle>
              <CardDescription className="text-slate-300">
                Get a unique URL for each of your snippets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                Share your creations with the world using permanent, shareable links for all your published snippets.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
