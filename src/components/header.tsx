import Image from "next/image";
import Link from "next/link";

import { Navigation } from "@/components/navigation";

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full bg-primary-foreground p-4 shadow-md">
      <div className="mx-auto flex h-10 max-w-screen-2xl items-center justify-between">
        <Link className="flex items-center gap-x-2" href="/">
          <Image src="/logo.svg" alt="Logo" width={28} height={28} priority />
          <p className="text-sm font-semibold">TopicHub</p>
        </Link>
        <Navigation />
      </div>
    </header>
  );
}
