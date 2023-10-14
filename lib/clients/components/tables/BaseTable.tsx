import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import { nanoid } from 'nanoid';
import { ReactNode } from 'react';

export type Paging = {
  totalRows: number;
  rowsPerPage: number;
  page: number;
};

export type HeadCell<TRow extends { [key: string]: unknown }> = {
  id: keyof TRow;
  disablePadding: boolean;
  label: string;
  align?: 'left' | 'right' | 'center';
};

export type BaseTableProps<TRow extends { [key: string]: unknown }> = {
  rowsPerPageOptions: number[];
  heads: HeadCell<TRow>[];
  rows: TRow[];
  paging: Paging;
  onPageChange: (newPage: number) => Promise<void>;
  onRowPerPageChange: (newRowPerPage: number) => Promise<void>;
};

export function BaseTable<TRow extends { [key: string]: unknown }>({
  heads,
  rows,
  paging: { rowsPerPage, totalRows, page },
  onPageChange,
  onRowPerPageChange,
  rowsPerPageOptions,
}: BaseTableProps<TRow>) {
  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {heads.map((head) => (
                <TableCell
                  key={nanoid(3)}
                  align={head.align || 'left'}
                  padding={head.disablePadding ? 'none' : 'normal'}
                >
                  {head.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={nanoid(4)}>
                {heads.map((head, idx) => {
                  const value = row[head.id] as ReactNode;
                  if (idx === 0) {
                    return (
                      <TableCell key={nanoid(3)} component="th" scope="row">
                        {value}
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell key={nanoid(3)} align="left">
                      {value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={({ target: { value } }) => onRowPerPageChange(Number.parseInt(value, 10))}
      />
    </>
  );
}
