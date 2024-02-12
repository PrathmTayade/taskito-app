import Image from "next/image";
import Link from "next/link";
import { cn, headingFont } from "@/lib/utils";

export const Logo = () => {
  return (
    <Link href="/">
      <div className="hidden relative items-center gap-x-2 transition hover:opacity-75 md:flex">
        <Image
          src="/logo.svg"
          alt="Logo"
          height={32}
          width={32}
          className="w-8 h-8"
        />
        <p className={cn(" text-lg text-neutral-700", headingFont.className)}>
          Taskify
        </p>
      </div>
    </Link>
  );
};
