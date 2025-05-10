import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface MainPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPagination: boolean;
}

const MainPagination: React.FC<MainPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showPagination,
}) => {
  if (!showPagination) return null;

  return (
    <div className="mt-4 flex justify-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(currentPage - 1)}
              className={`${
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              } text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100`}
            >
              上一页
            </PaginationPrevious>
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => onPageChange(page)}
                isActive={currentPage === page}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(currentPage + 1)}
              className={`${
                currentPage === totalPages ? "pointer-events-none opacity-50" : ""
              } text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100`}
            >
              下一页
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default MainPagination; 