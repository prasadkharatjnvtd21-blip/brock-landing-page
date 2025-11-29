"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { memo, useEffect, useState } from "react";

const FloatingDockContent = memo(() => {
  const pathname = usePathname();
  const router = useRouter();
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const dockItems = [
    { path: "/", label: "Home", key: "1" },
    { path: "/properties", label: "Properties", key: "2" },
    { path: "/programs", label: "Programs", key: "3" },
    { path: "/calculators", label: "Tools", key: "4" },
    { path: "/contact", label: "Contact", key: "5" },
  ];

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Number keys 1-5 for direct navigation
      if (e.key >= "1" && e.key <= "5") {
        const index = parseInt(e.key) - 1;
        if (dockItems[index]) {
          e.preventDefault();
          router.push(dockItems[index].path);
        }
      }

      // Arrow key navigation
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        setFocusedIndex((prev) => {
          if (prev === -1) return 0;
          if (e.key === "ArrowLeft") {
            return prev > 0 ? prev - 1 : dockItems.length - 1;
          } else {
            return prev < dockItems.length - 1 ? prev + 1 : 0;
          }
        });
      }

      // Enter to navigate to focused item
      if (e.key === "Enter" && focusedIndex >= 0) {
        e.preventDefault();
        router.push(dockItems[focusedIndex].path);
      }

      // Escape to clear focus
      if (e.key === "Escape") {
        setFocusedIndex(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex, router]);

  return (
    <div className="fixed bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-2xl px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-full border border-white/30 dark:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] flex gap-0.5 sm:gap-1">
        {dockItems.map((item, index) => (
          <Link
            key={item.path}
            href={item.path}
            prefetch={true}
            onMouseEnter={() => setFocusedIndex(index)}
            onMouseLeave={() => setFocusedIndex(-1)}
            className={`relative px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
              isActive(item.path)
                ? "bg-blue-600/90 text-white dark:bg-blue-500/90 shadow-lg backdrop-blur-sm"
                : focusedIndex === index
                ? "bg-white/40 dark:bg-gray-800/40 text-gray-900 dark:text-white ring-2 ring-blue-400/60 dark:ring-blue-500/60 ring-offset-2 ring-offset-transparent backdrop-blur-sm"
                : "text-gray-900 dark:text-white hover:bg-white/30 dark:hover:bg-gray-800/30 backdrop-blur-sm"
            }`}
          >
            {item.label}
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {item.key}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
});

FloatingDockContent.displayName = "FloatingDockContent";

export const FloatingDock = FloatingDockContent;