"use client";

import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabsNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Tabs
      value={pathname === "/dashboard" ? "home" : "customize"}
      className="w-full max-w-[200px] mr-4"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="home" onClick={() => router.push("/dashboard")}>
          Dashboard
        </TabsTrigger>
        <TabsTrigger value="customize" onClick={() => router.push("/custom")}>
          Customize
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
