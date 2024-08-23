"use client";
import Expenses from "@/components/dashboard/Expenses";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import DashboardMonthlyCharts from "@/components/dashboard/DashboardMonthlyCharts";
import DashboardYearlyCharts from "@/components/dashboard/DashboardYearlyCharts";
import ButtonAccount from "@/components/ButtonAccount";
import Link from "next/link";
export const dynamic = "force-dynamic";
import config from "@/config";
import logo from "@/app/icon.png";
import Image from "next/image";
import DashboardLabelCharts from "@/components/dashboard/DashboardLabelCharts";
import { FaArrowUp } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("august");
  const [budget, setBudget] = useState("0");
  const [monthlyExpenses, setMonthlyExpenses] = useState([
    { name: "", cost: "", category: "", label: "" },
  ]);
  const [yearlyExpenses, setYearlyExpenses] = useState([
    { name: "", cost: "", category: "", label: "" },
  ]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);

  // Fetch expenses on component mount
  useEffect(() => {
    const fetchExpenses = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        const response = await axios.get(`/api/dashboard`, {
          params: { userId, month: selectedMonth },
        });

        const data = response?.data?.monthlyExpenses[0];

        setMonthlyExpenses(
          data?.expenses || [{ name: "", cost: "", category: "", label: "" }]
        );
        setYearlyExpenses(
          response?.data?.allExpenses || [
            { name: "", cost: "", category: "", label: "" },
          ]
        );

        setBudget(data?.budget || "0");
      } catch (error) {
        console.error("Error fetching expenses:", error);
        toast.error("Error fetching expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [userId, selectedMonth, update]);

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
          <ButtonAccount />
        </header>
        <div className="grid flex-1 grid-cols-1 gap-4 p-4 sm:px-6 sm:py-0 md:grid-cols-3 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <DashboardSummary
              setBudget={setBudget}
              budget={budget}
              userId={userId}
              selectedMonth={selectedMonth}
              rows={monthlyExpenses}
            />
            <Expenses
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              budget={budget}
              savedRows={monthlyExpenses}
              setSavedRows={setMonthlyExpenses}
              userId={userId}
              loading={loading}
              setLoading={setLoading}
              update={update}
              setUpdate={setUpdate}
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
