"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, LayoutList, Loader2 } from "lucide-react";
import { extractSearchParams } from "@/app/lib/utils";
import { updateCookies } from "@/app/lib/update_cookies";

import { Grid2x2 } from "@/icons/grid2x2";
import { Grid3x3 } from "@/icons/grid3x3";
import { Grid4x4 } from "@/icons/grid4x4";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/app/components/hooks/use_media_query";

export function ProductGridSize() {
  const router = useRouter();
  const params = useSearchParams();
  const sp = extractSearchParams(params.entries());
  const [optimisticGrid, setOptimisticGrid] = useOptimistic(sp.grid);
  const [isPending, startTransition] = useTransition();
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const newParams = new URLSearchParams(
    Object.entries(sp).filter(([k, v]) => (v ? v && k !== "grid" : v)),
  );
  const ps = newParams.toString();

  const handleGridChange = (value: string) => {
    if (optimisticGrid === value) {
      router.push(`/products?${ps}`);
      updateCookies({ grid: undefined });
      return;
    }

    startTransition(() => {
      setOptimisticGrid(value);
      const updatedParams = ps ? `${ps}&grid=${value}` : `grid=${value}`;
      router.push(`/products?${updatedParams}`);
      updateCookies({ grid: value });
    });
  };

  if (isMobile) {
    return (
      <div className="col-span-full hidden items-center min-[381px]:flex">
        <Button
          variant="ghost"
          data-active={optimisticGrid === "1"}
          className='rounded-md p-2 ring-1 ring-transparent hover:bg-transparent data-[active="true"]:shadow data-[active="true"]:ring-input'
          onClick={() => handleGridChange("1")}
        >
          <LayoutList className="size-6 stroke-[1.5px]" />
        </Button>
        <Button
          variant="ghost"
          data-active={optimisticGrid === "2"}
          className='hidden rounded-md p-2 ring-1 ring-transparent hover:bg-transparent data-[active="true"]:shadow data-[active="true"]:ring-input md:inline-flex'
          onClick={() => handleGridChange("2")}
        >
          <Grid2x2 />
        </Button>

        {isPending && (
          <div className="ml-4 p-1">
            <Loader2 className="size-5 animate-[spin_1s_linear_infinite]" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="col-span-full hidden items-center gap-1 lg:flex">
      <Button
        variant="ghost"
        data-active={optimisticGrid === "2"}
        className='rounded-md p-2 ring-1 ring-transparent hover:bg-transparent data-[active="true"]:shadow data-[active="true"]:ring-input'
        onClick={() => handleGridChange("2")}
      >
        <Grid2x2 />
      </Button>
      <Button
        variant="ghost"
        data-active={optimisticGrid === "3"}
        className='rounded-md p-2 ring-1 ring-transparent hover:bg-transparent data-[active="true"]:shadow data-[active="true"]:ring-input'
        onClick={() => handleGridChange("3")}
      >
        <Grid3x3 />
      </Button>
      <Button
        variant="ghost"
        data-active={optimisticGrid === "4"}
        className='rounded-md p-2 ring-1 ring-transparent hover:bg-transparent data-[active="true"]:shadow data-[active="true"]:ring-input'
        onClick={() => handleGridChange("4")}
      >
        <Grid4x4 />
      </Button>

      {isPending && (
        <div className="ml-4 p-1">
          <Loader2 className="size-5 animate-[spin_1s_linear_infinite]" />
        </div>
      )}
    </div>
  );
}
