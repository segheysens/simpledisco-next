import Link from "next/link";
import {
  FaCalendar,
  FaChevronRight,
  FaLifeRing,
  FaSearch,
} from "react-icons/fa";

const links = [
  {
    name: "Meetings",
    href: "/meetings",
    description:
      "If you already have a SimpleDisco account, get back to the app here.",
    icon: FaCalendar,
  },
  {
    name: "Help & Guides",
    href: "/help",
    description:
      "Help articles and guides to help you get started with SimpleDisco.",
    icon: FaLifeRing,
  },
];

export default function NotFound() {
  return (
    <div className="bg-white">
      <main className="mx-auto w-full max-w-7xl px-6 pb-16 pt-10 sm:pb-24 lg:px-8">
        <FaSearch className="mx-auto h-12 w-12 text-emerald-400" />
        <div className="mx-auto mt-20 max-w-2xl text-center sm:mt-24">
          <p className="text-base font-semibold leading-8 text-emerald-500">
            404
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            This page does not exist
          </h1>
          <p className="mt-4 text-base leading-7 text-gray-600 sm:mt-6 sm:text-lg sm:leading-8">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-lg sm:mt-20">
          <h2 className="sr-only">Popular pages</h2>
          <ul
            role="list"
            className="-mt-6 divide-y divide-gray-900/5 border-b border-gray-900/5"
          >
            {links.map((link, linkIdx) => (
              <li key={linkIdx} className="relative flex gap-x-6 py-6">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg shadow-sm ring-1 ring-gray-900/10">
                  <link.icon
                    aria-hidden="true"
                    className="h-6 w-6 text-emerald-500"
                  />
                </div>
                <div className="flex-auto">
                  <h3 className="text-sm font-semibold leading-6 text-gray-900">
                    <Link href={link.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {link.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {link.description}
                  </p>
                </div>
                <div className="flex-none self-center">
                  <FaChevronRight
                    aria-hidden="true"
                    className="h-5 w-5 text-gray-400"
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center">
            <a
              href="/"
              className="text-sm font-semibold leading-6 text-emerald-500"
            >
              <span aria-hidden="true">&larr;</span>
              Back to home
            </a>
          </div>
        </div>
      </main>
      <footer className="border-t border-gray-100 py-6 sm:py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-8 px-6 sm:flex-row lg:px-8">
          <p className="text-sm leading-7 text-gray-400">
            &copy; SimpleDisco, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
