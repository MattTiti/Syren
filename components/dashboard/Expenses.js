import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaInfoCircle } from "react-icons/fa";
import axios from "axios";
import { CategoryCombobox } from "@/components/CategoryCombobox";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Spinner from "@/components/Spinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectTriggerColor,
} from "@/components/ui/select";
import ExpensesFooter from "./ExpensesFooter";

const Expenses = ({
  selectedMonth,
  setSelectedMonth,
  budget,
  savedRows,
  setSavedRows,
  userId,
  loading,
  setLoading,
  setUpdate,
  update,
}) => {
  const [smartAddValue, setSmartAddValue] = useState("");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([
    { name: "", cost: "", category: "", label: "" },
  ]);

  useEffect(() => {
    if (savedRows) {
      setRows(savedRows);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [savedRows]);
  const addRow = () => {
    setRows([...rows, { name: "", cost: "", category: "", label: "" }]);
  };

  const handleCategoryChange = (index, category) => {
    setRows(rows.map((row, i) => (i === index ? { ...row, category } : row)));
  };

  const handleDeleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSavedRows(rows);

    try {
      const response = await axios.put("/api/expenses", {
        userId,
        month: selectedMonth,
        budget,
        expenses: rows,
      });
      toast.success("Expenses saved successfully!");
    } catch (error) {
      toast.error("Error saving expenses");
    } finally {
      setLoading(false);
      setUpdate(!update);
    }
  };

  const handleSmartAdd = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/parse", {
        bankStatement: smartAddValue,
      });

      const newExpenses = Array.isArray(response.data.expenses)
        ? response.data.expenses
        : [response.data.expenses];

      let newRows = [...rows, ...newExpenses];

      // Filter out the initial empty row if it exists
      newRows = newRows.filter(
        (row) =>
          row.name.trim() !== "" ||
          row.cost.trim() !== "" ||
          row.category.trim() !== ""
      );

      try {
        // Saving the response data before updating state because the state update is async
        const saveResponse = await axios.put("/api/expenses", {
          userId,
          month: selectedMonth,
          budget,
          expenses: newRows,
        });

        toast.success("Expenses saved successfully!");
      } catch (error) {
        toast.error("Error saving expenses");
      } finally {
        setLoading(false);
        setUpdate(!update);
      }
      setOpen(false);
    } catch (error) {
      toast.error("Error using OpenAI to parse expenses");
    } finally {
      setLoading(false);
      setSmartAddValue("");
    }
  };

  const handleReset = async () => {
    setSavedRows([{ name: "", cost: "", category: "", label: "" }]);
    try {
      const response = await axios.put("/api/expenses", {
        userId,
        month: selectedMonth,
        budget,
        expenses: [{ name: "", cost: "", category: "", label: "" }],
      });
      toast.success("Expenses cleared successfully!");
    } catch (error) {
      toast.error("Error saving expenses");
    } finally {
      setUpdate(!update);
    }
  };

  return (
    <form onSubmit={handleSave} className="lg:col-span-2">
      <Card className="sm:col-span-2">
        <CardHeader className="pb-3 flex justify-between items-start">
          <div className="flex w-full justify-between">
            <div>
              <CardTitle>Track Your Expenses</CardTitle>
              <CardDescription>
                Enter expenses and save changes to see updated graphics
              </CardDescription>
            </div>
            <Select onValueChange={setSelectedMonth} value={selectedMonth}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="january">January</SelectItem>
                  <SelectItem value="february">February</SelectItem>
                  <SelectItem value="march">March</SelectItem>
                  <SelectItem value="april">April</SelectItem>
                  <SelectItem value="may">May</SelectItem>
                  <SelectItem value="june">June</SelectItem>
                  <SelectItem value="july">July</SelectItem>
                  <SelectItem value="august">August</SelectItem>
                  <SelectItem value="september">September</SelectItem>
                  <SelectItem value="october">October</SelectItem>
                  <SelectItem value="november">November</SelectItem>
                  <SelectItem value="december">December</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Spinner />
          ) : (
            <div className="">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="flex items-center px-2 w-10">
                      <span>Label</span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="dark:hover:bg-muted/0 justify-start ml-2"
                          >
                            <FaInfoCircle />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64">
                          <div className="text-sm">
                            Labels allow for additional categorization of
                            expenses (e.g. Green = Good, Red = Bad)
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableHead>
                    <TableHead className="px-0"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows &&
                    rows.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            placeholder="Enter name"
                            value={row.name}
                            onChange={(e) =>
                              setRows(
                                rows.map((r, i) =>
                                  i === index
                                    ? { ...r, name: e.target.value }
                                    : r
                                )
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="Enter cost"
                            type="number"
                            value={row.cost}
                            onChange={(e) =>
                              setRows(
                                rows.map((r, i) =>
                                  i === index
                                    ? { ...r, cost: e.target.value }
                                    : r
                                )
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <CategoryCombobox
                            selectedCategory={row.category || ""}
                            onCategoryChange={(category) =>
                              handleCategoryChange(index, category)
                            }
                          />
                        </TableCell>
                        <TableCell className="flex mt-1 justify-start ml-1">
                          <Select
                            value={row.label}
                            onValueChange={(label) =>
                              setRows(
                                rows.map((r, i) =>
                                  i === index ? { ...r, label } : r
                                )
                              )
                            }
                          >
                            <SelectTriggerColor
                              className={
                                row.label === "red"
                                  ? `bg-${row.label}-600`
                                  : `bg-${row.label}-500`
                              }
                            ></SelectTriggerColor>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem
                                  value="green"
                                  className="bg-green-500 dark:focus:bg-green-600"
                                >
                                  <span className="inline-block w-full h-8 bg-blue-500 rounded"></span>
                                </SelectItem>
                                <SelectItem
                                  value="yellow"
                                  className="bg-yellow-500 dark:focus:bg-yellow-600"
                                >
                                  <span className="inline-block w-full h-8 bg-yellow-500 rounded"></span>
                                </SelectItem>
                                <SelectItem
                                  value="red"
                                  className="bg-red-600 dark:focus:bg-red-700"
                                >
                                  <span className="inline-block w-full h-8 bg-red-600 rounded"></span>
                                </SelectItem>
                                <SelectItem value="none" className="pl-10">
                                  <span className="flex items-center justify-center w-full h-8 rounded">
                                    None
                                  </span>
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="px-0">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRow(index)}
                          >
                            <FaTrash className="text-zinc-200" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <ExpensesFooter
          addRow={addRow}
          open={open}
          setOpen={setOpen}
          smartAddValue={smartAddValue}
          setSmartAddValue={setSmartAddValue}
          handleSmartAdd={handleSmartAdd}
          loading={loading}
          resetDialogOpen={resetDialogOpen}
          setResetDialogOpen={setResetDialogOpen}
          handleReset={handleReset}
        />
      </Card>
    </form>
  );
};

export default Expenses;
