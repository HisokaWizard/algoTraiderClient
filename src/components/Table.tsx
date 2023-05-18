import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  SxProps,
  useTheme,
  TableSortLabel,
  Box,
} from '@mui/material';
import React, { memo, useCallback } from 'react';
import { TickerId } from '../models';
import { Column, dataMapping, TableType } from './Table.config';
import { visuallyHidden } from '@mui/utils';
import { Order } from './SortUtils';

interface Props {
  columns: Column[];
  rows: TableType[];
  onClick?: (ticker: TickerId) => void;
  getTablePageState?: (page: number, rowsPerPage: number) => void;
  orderBy?: string;
  order?: Order;
  onRequestSort?: (event: React.MouseEvent<unknown>, property: keyof TableType) => void;
}

const sxFirstColumn: SxProps = {
  position: 'sticky',
  left: 0,
  backgroundColor: 'white',
  zIndex: 10,
};

const sxFirstColumnHeader: SxProps = {
  ...sxFirstColumn,
  zIndex: 11,
};

export const TableShares = memo(
  ({ columns, rows, onClick, getTablePageState, order, orderBy, onRequestSort }: Props) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);
    const theme = useTheme();

    const handleChangePage = useCallback(
      (event: unknown, newPage: number) => {
        setPage(newPage);
        getTablePageState?.(newPage, rowsPerPage);
      },
      [rowsPerPage],
    );

    const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    }, []);

    return (
      <Paper sx={{ width: '100%', overflow: 'hidden', backgroundColor: 'white' }}>
        <TableContainer sx={{ maxHeight: 480 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    sx={column.id === 'name' ? sxFirstColumnHeader : undefined}
                    key={column.id}
                    align={'left'}
                    style={{ minWidth: column.minWidth }}
                    sortDirection={orderBy === column.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={(event) => onRequestSort?.(event, column.id)}
                    >
                      {column.label}
                      {orderBy === column.id ? (
                        <Box component='span' sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={row.ticker}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            sx={
                              column.id === 'name'
                                ? { ...sxFirstColumn, color: theme.palette.primary.dark, py: 0 }
                                : { color: theme.palette.primary.dark, py: 0 }
                            }
                            key={column.id}
                            align={'left'}
                          >
                            {dataMapping(value, onClick ? () => onClick(row.ticker) : undefined)}
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
          rowsPerPageOptions={[10, 20, 50, 100, 200]}
          component='div'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    );
  },
);
