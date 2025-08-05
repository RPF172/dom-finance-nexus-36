import React from "react";
import { Dialog, DialogContent, DialogOverlay, DialogClose } from "@/components/ui/dialog";
import { Copy } from "lucide-react";

interface CollarIdModalProps {
  open: boolean;
  collarId: string;
  onClose: () => void;
}

export const CollarIdModal: React.FC<CollarIdModalProps> = ({ open, collarId, onClose }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(collarId);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay />
      <DialogContent className="max-w-md mx-auto p-6 rounded-lg shadow-lg bg-white text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome to Fag Camp.</h2>
        <div className="mb-4 text-lg">
          Your Collar ID # is: <span className="font-mono text-xl">{collarId}</span>
          <button
            onClick={handleCopy}
            className="ml-2 p-1 rounded hover:bg-gray-200 inline-flex items-center"
            title="Copy Collar ID"
            aria-label="Copy Collar ID"
          >
            <Copy size={18} />
          </button>
        </div>
        <p className="mb-4">Save this. Write it down. <br />this is your new identity.</p>
        <DialogClose asChild>
          <button className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">Close</button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
