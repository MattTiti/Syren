"use client";
import DemoExpenses from "@/components/demo/DemoExpenses";
import DemoDashboardSummary from "@/components/demo/DemoDashboardSummary";
import { useState, useEffect } from "react";
import DashboardMonthlyCharts from "@/components/dashboard/DashboardMonthlyCharts";
import DashboardYearlyCharts from "@/components/dashboard/DashboardYearlyCharts";
import Link from "next/link";
export const dynamic = "force-dynamic";
import config from "@/config";
import logo from "@/app/icon.png";
import Image from "next/image";
import DashboardLabelCharts from "@/components/dashboard/DashboardLabelCharts";
import { FaArrowUp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { FaInfoCircle } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaUserCircle } from "react-icons/fa";

export default function Demo() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("august");
  const [budget, setBudget] = useState("1000");
  const [monthlyExpenses, setMonthlyExpenses] = useState([
    {
      name: "Kroger",
      cost: "100",
      category: "groceries",
      label: "green",
    },
    {
      name: "Shake Shack",
      cost: "100",
      category: "dining",
      label: "yellow",
    },
    {
      name: "Best Buy",
      cost: "200",
      category: "entertainment",
      label: "red",
    },
    {
      name: "Netflix",
      cost: "10",
      category: "subscriptions",
      label: "yellow",
    },
    {
      name: "Uber",
      cost: "20",
      category: "transportation",
      label: "yellow",
    },
    {
      name: "Birthday Present",
      cost: "60",
      category: "other",
      label: "green",
    },
    {
      name: "Kroger",
      cost: "120",
      category: "groceries",
      label: "green",
    },
    {
      name: "Hulu",
      cost: "10",
      category: "subscriptions",
      label: "yellow",
    },
    {
      name: "Target",
      cost: "50",
      category: "other",
      label: "",
    },
    {
      name: "Walmart",
      cost: "35",
      category: "other",
      label: "",
    },
    {
      name: "Walgreens",
      cost: "60",
      category: "health",
      label: "",
    },
  ]);
  const [yearlyExpenses, setYearlyExpenses] = useState([
    {
      month: "august",
      expenses: [
        {
          name: "Kroger",
          cost: "100",
          category: "groceries",
          label: "green",
        },
        {
          name: "Shake Shack",
          cost: "100",
          category: "dining",
          label: "yellow",
        },
        {
          name: "Best Buy",
          cost: "200",
          category: "entertainment",
          label: "red",
        },
        {
          name: "Netflix",
          cost: "10",
          category: "subscriptions",
          label: "yellow",
        },
        {
          name: "Uber",
          cost: "20",
          category: "transportation",
          label: "yellow",
        },
        {
          name: "Birthday Present",
          cost: "30",
          category: "other",
          label: "green",
        },
        {
          name: "Kroger",
          cost: "220",
          category: "groceries",
          label: "green",
        },
        {
          name: "Hulu",
          cost: "10",
          category: "subscriptions",
          label: "yellow",
        },
        {
          name: "Target",
          cost: "50",
          category: "other",
          label: "",
        },
        {
          name: "Walmart",
          cost: "25",
          category: "other",
          label: "",
        },
        {
          name: "Walgreens",
          cost: "40",
          category: "health",
          label: "",
        },
      ],
    },
    {
      month: "june",
      expenses: [
        {
          name: "Kroger",
          cost: "100",
          category: "groceries",
          label: "green",
        },
        {
          name: "Shake Shack",
          cost: "100",
          category: "dining",
          label: "yellow",
        },
        {
          name: "Best Buy",
          cost: "200",
          category: "entertainment",
          label: "red",
        },
        {
          name: "Netflix",
          cost: "10",
          category: "subscriptions",
          label: "yellow",
        },
        {
          name: "Uber",
          cost: "20",
          category: "transportation",
          label: "yellow",
        },
        {
          name: "Birthday Present",
          cost: "60",
          category: "other",
          label: "green",
        },
        {
          name: "Kroger",
          cost: "120",
          category: "groceries",
          label: "green",
        },
        {
          name: "Hulu",
          cost: "10",
          category: "subscriptions",
          label: "yellow",
        },
        {
          name: "Target",
          cost: "50",
          category: "other",
          label: "",
        },
        {
          name: "Walmart",
          cost: "35",
          category: "other",
          label: "",
        },
        {
          name: "Walgreens",
          cost: "60",
          category: "health",
          label: "",
        },
      ],
    },
    {
      month: "may",
      expenses: [
        {
          name: "Kroger",
          cost: "100",
          category: "groceries",
          label: "green",
        },
        {
          name: "Shake Shack",
          cost: "100",
          category: "dining",
          label: "yellow",
        },
        {
          name: "Best Buy",
          cost: "400",
          category: "entertainment",
          label: "red",
        },
        {
          name: "Netflix",
          cost: "10",
          category: "subscriptions",
          label: "yellow",
        },
        {
          name: "Uber",
          cost: "20",
          category: "transportation",
          label: "yellow",
        },
        {
          name: "Birthday Present",
          cost: "60",
          category: "other",
          label: "green",
        },
        {
          name: "Kroger",
          cost: "120",
          category: "groceries",
          label: "green",
        },
        {
          name: "Hulu",
          cost: "10",
          category: "subscriptions",
          label: "yellow",
        },
        {
          name: "Target",
          cost: "50",
          category: "other",
          label: "",
        },
        {
          name: "Walmart",
          cost: "35",
          category: "other",
          label: "",
        },
        {
          name: "Walgreens",
          cost: "60",
          category: "health",
          label: "",
        },
      ],
    },
    {
      month: "april",
      expenses: [
        {
          name: "Kroger",
          cost: "100",
          category: "groceries",
          label: "green",
        },
        {
          name: "Shake Shack",
          cost: "100",
          category: "dining",
          label: "yellow",
        },
        {
          name: "Best Buy",
          cost: "200",
          category: "entertainment",
          label: "red",
        },
        {
          name: "Netflix",
          cost: "10",
          category: "subscriptions",
          label: "yellow",
        },
        {
          name: "Uber",
          cost: "20",
          category: "transportation",
          label: "yellow",
        },
        {
          name: "Birthday Present",
          cost: "60",
          category: "other",
          label: "green",
        },
        {
          name: "Kroger",
          cost: "120",
          category: "groceries",
          label: "green",
        },
        {
          name: "Hulu",
          cost: "10",
          category: "subscriptions",
          label: "yellow",
        },
        {
          name: "Target",
          cost: "50",
          category: "other",
          label: "",
        },
        {
          name: "Walmart",
          cost: "135",
          category: "other",
          label: "",
        },
        {
          name: "Walgreens",
          cost: "160",
          category: "health",
          label: "",
        },
      ],
    },
  ]);
  const [loading, setLoading] = useState(true);

  // Fetch expenses on component mount
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Link
            className="flex items-center gap-2 shrink-0"
            href="/"
            title={`${config.appName} hompage`}
          >
            <Image
              src={logo}
              alt={`${config.appName} logo`}
              className="w-8"
              placeholder="blur"
              priority={true}
              width={32}
              height={32}
            />
            <span className="font-extrabold text-lg">{config.appName}</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <FaUserCircle size={36} className="text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <div className="flex align-items-center justify-start p-1 bg-muted/90 border-white/80 border-solid border-2 mx-6 rounded text-sm text-white">
          <FaInfoCircle className="ml-1 mr-1 mt-0.5" size={16} />
          <span>
            This demo page offers limited functionality, showcasing the
            dashboard&apos;s UI. For full access to your personalized dashboard,
            please return to the{" "}
            <Link href="/" className="underline text-violet-400">
              home page
            </Link>
            .
          </span>
        </div>
        <div className="grid flex-1 grid-cols-1 gap-4 p-4 sm:px-6 sm:py-0 md:grid-cols-3 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <DemoDashboardSummary
              setBudget={setBudget}
              budget={budget}
              rows={monthlyExpenses}
            />
            <DemoExpenses
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              savedRows={monthlyExpenses}
              setSavedRows={setMonthlyExpenses}
              loading={loading}
              setLoading={setLoading}
            />
          </div>
          <div className="self-start">
            <div className="space-y-4">
              <DashboardMonthlyCharts
                monthlyExpenses={monthlyExpenses}
                selectedMonth={selectedMonth}
              />
              <DashboardYearlyCharts
                yearlyExpenses={yearlyExpenses}
                selectedMonth={selectedMonth}
              />
              <DashboardLabelCharts
                monthlyExpenses={monthlyExpenses}
                selectedMonth={selectedMonth}
              />
            </div>
          </div>
        </div>
      </div>
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-8 p-2 h-12 w-12 rounded-full dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 dark:hover:text-zinc-900"
        >
          <FaArrowUp size={16} />
        </Button>
      )}
    </div>
  );
}
