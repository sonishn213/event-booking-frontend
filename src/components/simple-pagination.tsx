import { Page } from "@/domain/domain";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton } from "@radix-ui/themes";

interface SimplePaginationProps {
  pagination: Page;
  onPageChange: (page: number) => void;
}

export function SimplePagination({
  pagination,
  onPageChange,
}: SimplePaginationProps) {
  const currentPage = pagination.number;
  const totalPages = pagination.totalPages;

  return (
    <div className="flex gap-2 items-center">
       <IconButton 
        asChild
        size="2"
        radius="full"
        variant="soft"
        
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage == 0}
      >
        <button >
          <ChevronLeft size="16" />
        </button>
      </IconButton>
      <div className="text-sm">
        Page {currentPage + 1} of {totalPages}
      </div>
      <IconButton 
        asChild
        size="2"
        radius="full"
        variant="soft"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage == (totalPages - 1)}
      >
        <button>
          <ChevronRight size="16"/>
        </button>
      </IconButton>
    </div>
  );
}
