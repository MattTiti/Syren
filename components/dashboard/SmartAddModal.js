import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { WandSparkles, CirclePlus } from "lucide-react";
  import Spinner from "@/components/Spinner";
  
  const SmartAddModal = ({ isOpen, onOpenChange, value, onChange, onAdd, loading }) => {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button type="button" onClick={() => onOpenChange(true)}>
            <WandSparkles size={14} className="mr-1" /> Smart Add
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Smart Add</DialogTitle>
            <DialogDescription>
              Paste or type values below and click add to extract foods.
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
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />
              <Button onClick={onAdd} className="mt-2">
                <CirclePlus size={16} className="mr-1" /> Add
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    );
  };
  
  export default SmartAddModal;