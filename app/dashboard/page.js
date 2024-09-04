"use client";
import Meal from "@/components/dashboard/Meal";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { FaArrowUp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import config from "@/config";
import logo from "@/app/icon.png";
import Image from "next/image";
import ButtonAccount from "@/components/ButtonAccount";
import DashboardWeeklyCalories from "@/components/dashboard/DashboardWeeklyCalories";
import DashboardWeeklyMacros from "@/components/dashboard/DashboardWeeklyMacros";

export const dynamic = "force-dynamic";

export default function Dashboard() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedDay, setSelectedDay] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [meals, setMeals] = useState([]);
  const [goal, setGoal] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 70,
  });
  const [weeklyCalories, setWeeklyCalories] = useState([]);
  const newMealRef = useRef(null);

  const fetchWeeklyData = async () => {
    if (!userId || !selectedDay) return;

    try {
      const endOfWeek = new Date(selectedDay);
      endOfWeek.setDate(endOfWeek.getDate() - 1); // End date is one day before the selected day
      const startOfWeek = new Date(selectedDay);
      startOfWeek.setDate(startOfWeek.getDate() - 7); // Start date is 7 days before the selected day

      console.log("Fetching weekly data for:", {
        startDate: startOfWeek.toISOString().split("T")[0],
        endDate: endOfWeek.toISOString().split("T")[0],
        selectedDay,
      });

      const response = await axios.get("/api/weekly", {
        params: {
          userId,
          startDate: startOfWeek.toISOString().split("T")[0],
          endDate: endOfWeek.toISOString().split("T")[0],
        },
      });

      if (response.status === 200) {
        setWeeklyCalories(response.data.meals);
      } else {
        console.error("Unexpected response status:", response.status);
        toast.error(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching weekly data:", error.response || error);
      toast.error(
        error.response?.data?.message || "Error fetching weekly data"
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !selectedDay) return;

      setLoading(true);
      try {
        const [mealsResponse, defaultGoalResponse] = await Promise.all([
          axios.get(`/api/meals`, {
            params: { userId, date: selectedDay },
          }),
          axios.get(`/api/default`),
        ]);

        if (mealsResponse.status === 200) {
          const data = mealsResponse.data?.meals || [];
          const savedGoal =
            mealsResponse.data?.goal ||
            defaultGoalResponse.data?.defaultGoal ||
            goal;

          setMeals(data);
          setGoal(savedGoal);
        } else {
          console.error("Unexpected response status:", mealsResponse.status);
          toast.error(`Unexpected response: ${mealsResponse.status}`);
        }

        await fetchWeeklyData();
      } catch (error) {
        console.error("Error fetching data:", error.response || error);
        toast.error(error.response?.data?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, selectedDay, update]);

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

  const handleSaveAll = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await axios.put(`/api/meals`, {
        userId,
        date: selectedDay,
        meals,
        goal,
      });

      toast.success("Meals and goal saved successfully!");
      setUpdate(!update);
    } catch (error) {
      console.error("Error saving meals and goal:", error);
      toast.error("Error saving meals and goal");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = () => {
    const newMeals = [...meals, { foods: [] }];
    setMeals(newMeals);

    // Schedule the scroll after the state has been updated and the component has re-rendered
    setTimeout(() => {
      if (newMealRef.current) {
        newMealRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Link
            className="flex items-center gap-2 shrink-0"
            href="/"
            title={`${config.appName} homepage`}
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
              setGoal={setGoal}
              goal={goal}
              meals={meals}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              userId={userId}
              loading={loading}
            />
            <div className="flex items-center justify-end gap-4">
              <Button type="button" onClick={handleAddMeal}>
                <CirclePlus size={16} className="mr-1" /> Add Meal
              </Button>
              <Button type="submit" onClick={handleSaveAll}>
                Save All
              </Button>
            </div>
            {meals.map((meal, index) => (
              <Meal
                key={index}
                ref={index === meals.length - 1 ? newMealRef : null}
                selectedDay={selectedDay}
                savedMeals={meals}
                setSavedMeals={setMeals}
                userId={userId}
                loading={loading}
                setLoading={setLoading}
                update={update}
                setUpdate={setUpdate}
                mealNum={index + 1}
              />
            ))}
          </div>
          <div className="self-start">
            <div className="space-y-4">
              <DashboardWeeklyCalories
                weeklyCalories={weeklyCalories}
                selectedWeek={selectedDay}
              />
              <DashboardWeeklyMacros
                weeklyCalories={weeklyCalories}
                selectedWeek={selectedDay}
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
