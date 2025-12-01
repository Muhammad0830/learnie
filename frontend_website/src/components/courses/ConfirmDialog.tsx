"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormType } from "@/schemas/courseItemsSchema";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  data,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: FormType | null;
}) {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm creation</DialogTitle>
        </DialogHeader>

        <pre className="bg-muted p-3 text-sm rounded max-h-60 overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>

        <div className="flex justify-end gap-2 mt-4">
          <button className="border px-3 py-1 rounded" onClick={onClose}>
            Close
          </button>
          <button className="bg-primary px-3 py-1 rounded" onClick={onConfirm}>
            Create
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
