import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const CustomPagination = ({ currentPage, totalPages, handlePageChange }) => {
  return (
    <Stack alignItems='center' spacing={2}>
      <Pagination 
        color='primary'
        count={totalPages} 
        page={currentPage} 
        onChange={handlePageChange} 
        size='large' 
      />
    </Stack>
  );
};

export default CustomPagination;
