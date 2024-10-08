"use client";

import { toast } from "sonner";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { Info, Trash2 } from "lucide-react";
import { useCartStore } from "../_store/cart";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button, ButtonProps } from "@/components/ui/button";
import { clearServerCart, removeFromServerCart } from "../_actions/actions";
import { LoadingButton } from "@/app/(public)/products/_components/skeletons/loading_btn";

type DeleteAction = "deleteOne" | "deleteAll";

type DeleteCartItemProps = {
  asin?: string;
  price?: number;
  action?: DeleteAction;
};

export function DeleteCartItems({ asin, price, action }: DeleteCartItemProps) {
  const { userId } = useAuth();
  const [dialogIsOpen, setDialogState] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [removeFromCart, clearCart] = useCartStore((s) => [
    s.removeFromCart,
    s.clearCart,
  ]);

  const handleDelete = () => {
    startTransition(async () => {
      if (action === "deleteOne") {
        if (asin) removeFromCart(asin);
        if (userId && asin && price) {
          try {
            await removeFromServerCart(userId, asin, price);
          } catch (error) {
            console.error(error);
          }
        }
      }
      if (action === "deleteAll") {
        clearCart();
        if (userId) {
          try {
            await clearServerCart(userId);
          } catch (error) {
            console.error(error);
          }
        }
      }
      toast.custom(() => (
        <div className="flex items-center gap-4">
          <Info className="text-blue-500" />
          {action == "deleteOne" && (
            <span className="text-sm">Item deleted from cart</span>
          )}
          {action == "deleteAll" && (
            <span className="text-sm">Cart cleared successfully</span>
          )}
        </div>
      ));
    });
  };

  return (
    <Dialog open={dialogIsOpen} onOpenChange={setDialogState}>
      <DialogTrigger asChild>
        <Button
          variant={action === "deleteAll" ? "ghost" : "outline"}
          title={action === "deleteOne" ? "Remove from cart" : "Empty cart"}
          className={cn(
            "size-7 p-1 hover:bg-transparent",
            action === "deleteOne" && "bg-destructive/20",
            action === "deleteAll" &&
              "border border-input hover:border-transparent hover:bg-destructive/20",
          )}
        >
          <Trash2 className="text-destructive" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription className="py-4">
            {action === "deleteOne"
              ? "This action will remove this item from your cart"
              : "This action will empty your cart"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            size={"sm"}
            variant={"outline"}
            className="text-xs"
            onClick={() => setDialogState(false)}
          >
            Cancel
          </Button>
          <LoadingButton className="bg-input" isLoading={isPending}>
            <Button
              size={"sm"}
              className="bg-destructive text-xs hover:bg-destructive/90"
              onClick={() => {
                handleDelete();
                setDialogState(false);
              }}
              disabled={isPending}
            >
              Procced
            </Button>
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
