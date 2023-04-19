import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from '@mui/material';
import React, { memo, useCallback } from 'react';
import { Column, dataMapping, TableType } from './Table.config';

interface Props {
  columns: Column[];
  rows: TableType[];
  onClick: (ticker: string) => void;
  getTablePageState: (page: number, rowsPerPage: number) => void;
}

export const TableShares = memo(({ columns, rows, onClick, getTablePageState }: Props) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = useCallback(
    (event: unknown, newPage: number) => {
      setPage(newPage);
      getTablePageState(newPage, rowsPerPage);
    },
    [rowsPerPage],
  );

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }, []);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', backgroundColor: '#242424' }}>
      <TableContainer sx={{ maxHeight: 450 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={'left'} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover tabIndex={-1} key={row.ticker}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={'left'} sx={{ color: '#a25dea', py: 1 }}>
                        {dataMapping(value, () => onClick(row.ticker))}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
});
