import { SignUp } from "@clerk/nextjs"
import { Globe } from "lucide-react"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <Globe className="h-6 w-6 text-purple-500" />
        <span className="text-xl font-bold">LiveSite</span>
      </Link>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: "bg-purple-600 hover:bg-purple-700",
              footerActionLink: "text-purple-600 hover:text-purple-700",
            },
          }}
          redirectUrl="/dashboard"
        />
    </div>
  )
}