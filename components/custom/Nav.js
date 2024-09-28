import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import ButtonAccount from "@/components/ButtonAccount";
import logo from "@/app/icon.png";
import TabsNavigation from "@/components/TabNavigation";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-yellow-50 shadow-sm w-full">
      <div className="flex items-center justify-between px-1 py-2 sm:mx-4">
        <Link
          className="flex items-center gap-2 shrink-0"
          href="/"
          title={`${config.appName} homepage`}
        >
          <Image
            src={logo}
            alt={`${config.appName} logo`}
            className="w-12 h-12"
            placeholder="blur"
            priority={true}
            width={48}
            height={48}
          />
          <span className="hidden sm:inline font-semibold text-xl text-neutral-700">
            {config.appName}
          </span>
        </Link>
        <div className="flex-grow flex justify-end items-center space-x-2 sm:space-x-4">
          <TabsNavigation />
          <ButtonAccount />
        </div>
      </div>
    </nav>
  );
}
