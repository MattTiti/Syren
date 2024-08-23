import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import Spinner from "@/components/Spinner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { CirclePlus, WandSparkles } from "lucide-react";

const ExpensesFooter = ({
  addRow,
  open,
  setOpen,
  smartAddValue,
  setSmartAddValue,
  handleSmartAdd,
  loading,
  resetDialogOpen,
  setResetDialogOpen,
  handleReset,
}) => {
  return (
    <CardFooter className="flex justify-between">
      <div className="flex gap-4">
        <Button type="button" onClick={addRow}>
          <CirclePlus size={16} className="mr-1" /> Add Row
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" onClick={() => setOpen(true)}>
              <WandSparkles size={14} className="mr-1" /> Smart Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Smart Add</DialogTitle>
              <DialogDescription>
                Paste or type values below and click add to extract expenses.
                Longer text will take longer to process.
              </DialogDescription>
            </DialogHeader>
            {loading ? (
              <Spinner />
            ) : (
              <>
                <textarea
                  placeholder="Paste or type values here..."
                  className="w-full h-24 p-2 border rounded"
                  value={smartAddValue}
                  onChange={(e) => setSmartAddValue(e.target.value)}
                />
                <Button onClick={handleSmartAdd} className="mt-2">
                  <CirclePlus size={16} className="mr-1" /> Add
                </Button>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex gap-4">
        <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button type="button" variant="ghost">
              Reset
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Reset</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to reset all expenses? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset}>
                Confirm Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button type="submit">Save</Button>
      </div>
    </CardFooter>
  );
};

export default ExpensesFooter;
