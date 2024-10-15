// File: src/app/page.tsx

import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PiDiscoBall } from "react-icons/pi";
import { FaUserTie } from "react-icons/fa";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SimpleDisco",
  description: "Welcome to SimpleDisco!",
};

const painQuotes = [
  {
    message:
      "The deal's going to slip because there's a new stakeholder who was just introduced.",
    author: "Seller Sam",
  },
  {
    message:
      "Let's drop my quarter commit number by about 5%. We just kicked off legal review on that deal and have no clue how long that'll take.",
    author: "Manager Mel",
  },
  {
    message:
      "I thought it was just us in the deal, but now they're evaluating our competitor.",
    author: "SalesRep Rachel",
  },
  {
    message:
      "It turns out they have a few other priorities, and we're being put on the backburner.",
    author: "CustomerSuccess Kendall",
  },
];

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <header
        aria-hidden="true"
        className="absolute top-4 left-4 sm:top-10 sm:left-10 z-10 flex flex-row items-center gap-2 scale-75 sm:scale-100"
      >
        <PiDiscoBall className="text-emerald-500 h-8 w-8" />
        <h2 className="text-2xl font-bold text-emerald-500">SimpleDisco</h2>
      </header>
      <div className="flex flex-col gap-16">
        <div className="w-full isolate px-6 pt-24 sm:pt-12 lg:px-8">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#03dd7f] to-[#03ddd6] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>

          <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:py-32">
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                Pre-seed fundraise November 2024.{" "}
                <Link href="#" className="font-semibold text-emerald-600">
                  <span aria-hidden="true" className="absolute inset-0" />
                  Interested in investing?{" "}
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                The AI sales discovery tool that drives{" "}
                <span className="text-amber-500">results</span> 💰
              </h1>

              <p className="mt-12 text-xl leading-8 text-gray-600">
                Does any of this sound familiar?
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 mt-8">
                {painQuotes.map((quote, index) => (
                  <figure
                    key={index}
                    className="border-l border-green-400 pl-8"
                  >
                    <blockquote className="text-xl font-semibold leading-8 tracking-tight text-gray-900">
                      <p className="text-start">&quot;{quote.message}&quot;</p>
                    </blockquote>
                    <figcaption className="mt-8 flex gap-x-4">
                      <div className="mt-1 h-10 w-10 flex justify-center items-center rounded-full bg-emerald-300">
                        <FaUserTie className="h-7 w-7 text-emerald-700 rounded-lg" />
                      </div>
                      <div className="text-sm flex items-center">
                        <div className="font-semibold text-gray-900">
                          {quote.author}
                        </div>
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>

              <p className="mt-12 text-xl leading-8 text-gray-600">
                Meet{" "}
                <span className="text-emerald-500 font-semibold">
                  SimpleDisco
                </span>
                , the first AI tool purpose-built for effective discovery.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <SignedIn>
                  <div className="p-4 rounded flex flex-row items-center gap-4 bg-gray-50 dark:bg-gray-800">
                    <Link href="/meetings">
                      <Button>Go to app</Button>
                    </Link>
                    <UserButton />
                  </div>

                  <SignOutButton>
                    <Button variant="destructive">Sign out</Button>
                  </SignOutButton>
                </SignedIn>
                <SignedOut>
                  <SignInButton>
                    <Button variant="outline">Sign in</Button>
                  </SignInButton>

                  <SignUpButton>
                    <div className="relative flex">
                      <Button>Sign up</Button>
                      <span className="absolute flex h-3 w-3 -top-1.5 -right-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                    </div>
                  </SignUpButton>
                </SignedOut>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
