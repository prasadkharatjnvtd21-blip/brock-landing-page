"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Menu, MessageCircle } from "lucide-react";
import { memo } from "react";

const HeaderContent = memo(() => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm h-[70px]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-20 h-full">
        <div className="flex items-center justify-between h-full gap-6">
          {/* Left Spacer */}
          <div className="flex-1 hidden md:block"></div>

          {/* Logo & Tagline - Centered */}
          <Link href="/" className="flex flex-col items-center justify-center gap-0.5" prefetch={true}>
            <Image
              src="https://pgen.co.in/assets/brock.svg"
              alt="Brock Logo"
              width={120}
              height={40}
              className="object-contain !w-full !h-[42px] !max-w-full"
              priority />

            <span className="text-[10px] text-gray-500 tracking-wide font-medium !w-[161px] !h-5">
              Your Dreams, Our Responsibility
            </span>
          </Link>

          {/* Actions - Far Right */}
          <div className="flex gap-3 items-center flex-1 justify-end">
            <Link
              href="/programs"
              prefetch={true}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg">

              List Property
            </Link>
            <a
              href="https://wa.me/911234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-all hover:-translate-y-0.5 hover:shadow-md"
              aria-label="WhatsApp">

              <MessageCircle className="w-5 h-5" />
            </a>
            <a
              href="tel:+911234567890"
              className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all hover:-translate-y-0.5 hover:shadow-md"
              aria-label="Call us">

              <Phone className="w-5 h-5" />
            </a>

            {/* Mobile Menu Button - Hidden on Desktop & Tablet */}
            <button className="md:hidden p-2 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Menu">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>);

});

HeaderContent.displayName = "HeaderContent";

export const Header = HeaderContent;