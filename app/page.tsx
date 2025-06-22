import Link from "next/link";
import Image from "next/image";
import { ChevronsLeftRight, CheckCircle2 } from "lucide-react";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0d0e11]">
      <header className="px-8 py-4 bg-[#0d0e11] border-b border-gray-800">
        <div className="flex items-center text-white justify-between mx-auto w-full max-w-7xl">
          <Link href="/" className="flex items-center gap-2">
            <ChevronsLeftRight className="text-[#cff245] h-6 w-6" />
            <span className="text-xl font-bold">LiveSite</span>
          </Link>
          <nav className="hidden md:flex text-sm gap-8">
            <Link href="/" className="underline">
              Home
            </Link>
            <Link href="#features" className="hover:underline">
              Features
            </Link>
            <Link href="#pricing" className="hover:underline">
              Pricing
            </Link>
            <Link href="mailto:business.pulkitgarg@gmail.com" className="hover:underline">
              Contact
            </Link>
          </nav>
          <Link href="/dashboard" className="text-sm py-1 px-4 border rounded-xl">
            Login
          </Link>
        </div>
      </header>

      <main className="px-8 py-20 relative items-center overflow-hidden max-h-[900px]">
        <div className="flex flex-col gap-6 items-center text-white mx-auto w-full max-w-5xl">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter text-center">
            Deploy your <span className="text-[#cff245]">static sites</span>
            <br /> in seconds
          </h1>
          <p className="font-normal text-lg text-center">
            LiveSite helps you deploy{" "}
            <span className="text-[#cff245]">HTML, CSS, and JavaScript</span>{" "}
            single-page websites instantly
          </p>
          <div className="mt-12 w-full max-w-[800px]">
            <Image
              src="/hero-image.png"
              width={800}
              height={400}
              className="mx-auto rounded-xl shadow-2xl"
              alt="LiveSite deployment preview"
            />
          </div>
        </div>
      </main>

      <section id="features" className="px-8 py-20 bg-[#f6f7fa] rounded-t-3xl">
        <div className="flex flex-col gap-16 items-center mx-auto w-full max-w-5xl">
          <h2 className="text-4xl font-semibold tracking-tighter text-center text-gray-900">
            With LiveSite, you can:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4 bg-white rounded-3xl p-8">
              <Image
                src="/access-anywhere.png"
                width={500}
                height={300}
                className="mx-auto mb-6"
                alt="LiveSite mobile interface"
              />
              <h3 className="text-xl font-bold text-gray-900">Access from Anywhere</h3>
              <p className="text-sm text-gray-600">
                You can access your site from anywhere, anytime on the internet.
              </p>
              <Link
                href="/dashboard"
                className="bg-[#cff245] px-4 py-2 text-black rounded-xl w-fit"
              >
                Get Started
              </Link>
            </div>
            <div className="flex flex-col gap-4 bg-white rounded-3xl p-8 relative overflow-hidden min-h-[400px]">
              <h3 className="text-xl font-bold text-gray-900">
                Instant Deployment
              </h3>
              <p className="text-sm text-gray-600">
                Deploy your site instantly with just a few clicks. No more
                waiting for servers or complicated setups.
              </p>
              <Link
                href="/dashboard"
                className="bg-[#cff245] px-4 py-2 text-black rounded-xl w-fit"
              >
                Get Started
              </Link>
              <Image
                src="/hero-black.png"
                width={320}
                height={200}
                className="absolute bottom-0 right-0 max-w-[80%]"
                alt="LiveSite dashboard"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-8 py-20">
        <div className="flex flex-col gap-12 items-center mx-auto w-full max-w-3xl">
          <h2 className="text-4xl font-semibold tracking-tighter text-center text-white">
            More Tools to Enhance Your Workflow
          </h2>
          <div className="flex flex-wrap justify-center gap-4 w-full">
            {[
              "Instant Deploy",
              "Custom Domains",
              "Analytics",
              "SSL Certificates",
              "CDN Support",
              "Team Access",
              "API Access",
              "24/7 Support",
            ].map((tool) => (
              <div
                key={tool}
                className="flex w-[100px] flex-col gap-2 p-6 rounded-xl border border-gray-200 items-center bg-white"
              >
                <CheckCircle2 className="h-8 w-8 text-[#cff245]" />
                <span className="text-center text-sm font-bold">{tool}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      <section id="pricing" className="px-8 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-4xl font-semibold tracking-tighter text-white text-center">
            Level up your deployment experience
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
            {[
              {
                title: "LiveSite - Basic",
                price: "$0",
                features: [
                  "Instant site deployment",
                  "Custom slug support",
                  "3 team members",
                  "Community access",
                ],
              },
              {
                title: "LiveSite - Pro",
                price: "$10 /year",
                features: [
                  "Save 33% - 4 months free",
                  "All Monthly features",
                  "Advanced analytics",
                  "10 team members",
                  "Priority support",
                  "API access",
                ],
                highlight: true,
              },
              {
                title: "LiveSite - Perpetual",
                price: "$50 /one-time",
                features: [
                  "Pay once, use forever",
                  "All Yearly features",
                  "Unlimited team members",
                  "Premium support",
                  "Lifetime updates",
                ],
              },
            ].map((plan) => (
              <div
                key={plan.title}
                className={`flex flex-col justify-between h-full p-8 rounded-3xl ${
                  plan.highlight
                    ? "bg-[#cff245] text-black"
                    : "bg-gray-50 text-gray-900"
                }`}
              >
                <div className="flex flex-col">
                  <h3 className="mt-4 font-medium">{plan.title}</h3>
                  <div className="text-2xl font-medium">{plan.price}</div>
                  <p className="mt-2 text-xs italic text-gray-600">
                    Excluding local taxes or GST if applicable
                  </p>
                  <ul className="flex flex-col gap-2 mt-8 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                        <p>{feature}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/dashboard"
                  className="mt-8 flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-semibold bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f6f7fa] rounded-3xl">
        <div className="h-full max-w-5xl mx-auto">
          <div className="flex flex-col gap-12">
            <div>
              <h2 className="font-semibold tracking-tighter text-5xl text-center">
                FAQ
              </h2>
              <p className="mx-auto mt-4 text-sm text-gray-600 text-center">
                Frequent questions &amp; answers
              </p>
            </div>
            <div className="flex flex-col mx-auto max-w-2xl gap-6 text-base text-gray-400 w-full px-4">
              <details>
                <summary className="cursor-pointer text-base font-medium tracking-tight text-gray-900">
                  What is LiveSite?
                </summary>
                <p className="pt-4 text-sm text-gray-500">
                  LiveSite is a platform that allows you to deploy static HTML,
                  CSS, and JavaScript websites instantly with custom domains and
                  security features.
                </p>
              </details>
              <details>
                <summary className="cursor-pointer text-base font-medium tracking-tight text-gray-900">
                  What coding languages does LiveSite support?
                </summary>
                <p className="pt-4 text-sm text-gray-500">
                  LiveSite supports HTML, CSS, and JavaScript for building
                  static websites.
                </p>
              </details>
              <details>
                <summary className="cursor-pointer text-base font-medium tracking-tight text-gray-900">
                  How fast can I deploy my website?
                </summary>
                <p className="pt-4 text-sm text-gray-500">
                  With LiveSite, you can deploy your website in seconds using
                  our intuitive tools.
                </p>
              </details>
              <details>
                <summary className="cursor-pointer text-base font-medium tracking-tight text-gray-900">
                  How can I track my website&apos;s deployment progress?
                </summary>
                <p className="pt-4 text-sm text-gray-500">
                  With LiveSite, you can easily monitor your website&apos;s
                  deployment status through our dashboard, which provides
                  real-time updates and notifications.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-8 py-20 flex flex-col gap-12">
        <div className="mx-auto max-w-5xl">
          <div className="text-white">
            <div className="inline-flex items-center gap-3">
              <p className="text-2xl font-bold uppercase">LiveSite</p>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              LiveSite makes static site deployment effortless with instant
              setup, custom domains, and top-tier security.
            </p>
          </div>
          <div className="flex flex-col pt-12 md:flex-row md:items-center md:justify-between">
            <p className="text-left text-xs text-gray-500">
              © {new Date().getFullYear()} LiveSite. All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
