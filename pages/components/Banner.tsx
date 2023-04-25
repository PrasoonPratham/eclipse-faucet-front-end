import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Link from "next/link";

interface BannerProps {
    Text: string;
    LinkToTarget: string;
}

export default function Banner({ Text, LinkToTarget }: BannerProps): any {
  const [displayBanner, setDisplayBanner] = useState(true);
  if (!displayBanner) {
      return <></>;
  }
  if (displayBanner) {
    return (
      <div className="sticky top-0 bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-green-500/95 to-blue-400/90 backdrop-blur-md z-20">
        <div className="mx-auto max-w-7xl py-3 px-3 sm:px-6 lg:px-8">
          <div className="pr-16 sm:px-16 sm:text-center">
            <p className="font-medium text-white">
              <span className=" md:inline">{Text}</span>
              <span className="block sm:ml-2 sm:inline-block">
                <Link href={LinkToTarget} className="font-bold text-white underline" target="_blank" rel="noopener noreferrer">
                    Learn more
                <span aria-hidden="true"> &rarr;</span>
                </Link>
              </span>
            </p>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:items-start sm:pt-1 sm:pr-2">
            <button
              type="button"
              className="flex rounded-md p-2 hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white"
              onClick={() => setDisplayBanner(false)}
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}