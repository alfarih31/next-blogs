import { Box, Chip, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import { appClientConfig } from '$configs/clients/app.client.config';
import { ReactNode } from 'react';
import { DynamicFeed } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import type { BaseTableProps, HeadCell } from './BaseTable';
import { BaseTable } from './BaseTable';

type BodyCell = {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

type FinalCell = BodyCell & { url: ReactNode; actions: ReactNode };
const headCells: HeadCell<FinalCell>[] = [
  {
    id: 'id',
    disablePadding: false,
    label: 'Id',
  },
  {
    id: 'name',
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'slug',
    disablePadding: false,
    label: 'Slug',
  },
  {
    id: 'url',
    disablePadding: false,
    label: 'URL',
  },
  {
    id: 'createdAt',
    disablePadding: false,
    label: 'Created At',
  },
  {
    id: 'updatedAt',
    disablePadding: false,
    label: 'Updated At',
  },
  {
    id: 'actions',
    disablePadding: false,
    label: 'Actions',
    align: 'center',
  },
];

export const StyledSpeedDial = styled(SpeedDial)(() => ({
  position: 'absolute',
  '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
    transform: 'translate(-50%, -50%)',
  },
}));

export type BlogTableProps = Omit<BaseTableProps<BodyCell>, 'heads' | 'rowsPerPageOptions'> & {
  onClickRow: (blogId: number) => Promise<void>;
};

function ActionButton({ blogId, onClickRow }: Pick<BlogTableProps, 'onClickRow'> & { blogId: number }) {
  return (
    <Box sx={{ position: 'relative' }}>
      <StyledSpeedDial ariaLabel="SpeedDial playground example" icon={<SpeedDialIcon />} direction="left">
        <SpeedDialAction icon={<DynamicFeed />} tooltipTitle="List Posts" onClick={() => onClickRow(blogId)} />
      </StyledSpeedDial>
    </Box>
  );
}

export function BlogTable({ rows, paging, onPageChange, onRowPerPageChange, onClickRow }: BlogTableProps) {
  return (
    <BaseTable<FinalCell>
      rowsPerPageOptions={[2, 4, 8]}
      heads={headCells}
      rows={rows.map((r) => ({
        ...r,
        url: (
          <Link href={`${appClientConfig.PUBLIC_URL}/${r.slug}`}>
            <Chip label={`${appClientConfig.PUBLIC_URL}/${r.slug}`} variant="outlined" />
          </Link>
        ),
        actions: <ActionButton onClickRow={onClickRow} blogId={r.id} />,
      }))}
      paging={paging}
      onPageChange={onPageChange}
      onRowPerPageChange={onRowPerPageChange}
    />
  );
}
