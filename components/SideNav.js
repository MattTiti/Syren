"use client";

import Link from "next/link";
import {
  Siren,
  Home,
  SlidersHorizontal,
  Users,
  Send,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";
import ButtonAccount from "@/components/ButtonAccount";

export function SideNav() {
  const pathname = usePathname();
  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Siren className="h-6 w-6" />
          <span className="">Syren</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <NavItem
            href="/dashboard"
            icon={Home}
            label="Dashboard"
            active={pathname === "/dashboard"}
          />
          <NavItem
            href="/organization"
            icon={Building2}
            label="Organization"
            active={pathname === "/organization"}
          />
          <NavItem
            href="/custom"
            icon={SlidersHorizontal}
            label="Custom"
            active={pathname === "/custom"}
          />
          <NavItem
            href="/users"
            icon={Users}
            label="Users"
            active={pathname === "/users"}
          />
          <NavItem
            href="/send"
            icon={Send}
            label="Send"
            active={pathname === "/send"}
          />
        </nav>
      </div>
      <div className="mt-auto border-t pt-4 p-4">
        <div className="flex items-center gap-3">
          <ButtonAccount />
          <div className="flex flex-col">
            <span className="text-sm font-medium">John Doe</span>
            <span className="text-xs text-muted-foreground">
              john@example.com
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ href, icon: Icon, label, badge, active }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300 ease-in-out ${
        active
          ? "bg-muted text-primary"
          : "text-muted-foreground hover:bg-muted/50 hover:text-primary"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
      {badge && (
        <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
          {badge}
        </Badge>
      )}
    </Link>
  );
}
