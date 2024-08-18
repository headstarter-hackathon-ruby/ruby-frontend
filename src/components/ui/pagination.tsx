import React from 'react';
import { Button } from './button';

interface PaginationProps {
  complaintsPerPage: number;
  totalComplaints: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  complaintsPerPage,
  totalComplaints,
  paginate,
  currentPage
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalComplaints / complaintsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center mt-4">
      <ul className="flex space-x-2">
        {pageNumbers.map(number => (
          <li key={number}>
            <Button
              onClick={() => paginate(number)}
              variant={currentPage === number ? 'default' : 'outline'}
            >
              {number}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
};