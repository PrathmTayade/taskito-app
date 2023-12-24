import Image from "next/image";
import Link from "next/link";
import { cn, headingFont } from "@/lib/utils";

export const Logo = () => {
  return (
    <Link href="/">
      <div className="hidden items-center gap-x-2 transition hover:opacity-75 md:flex">
        <Image src="/logo.svg" alt="Logo" height={30} width={30} />
        <p
          className={cn("pb-1 text-lg text-neutral-700", headingFont.className)}
        >
          Taskify
        </p>
      </div>
    </Link>
  );
};
