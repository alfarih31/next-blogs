import { ReactNode } from 'react';
import { Chip } from '@mui/material';
import { appClientConfig } from '$configs/clients/app.client.config';
import Link from 'next/link';
import type { BaseTableProps, HeadCell } from './BaseTable';
import { BaseTable } from './BaseTable';

type BodyCell = {
  id: number;
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  blog: {
    slug: string;
  };
};

type FinalCell = BodyCell & { url: ReactNode };

const headCells: HeadCell<FinalCell>[] = [
  {
    id: 'id',
    disablePadding: false,
    label: 'Id',
  },
  {
    id: 'title',
    disablePadding: false,
    label: 'Title',
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
];

export type BlogPostTableProps = Omit<BaseTableProps<BodyCell>, 'heads' | 'rowsPerPageOptions'>;

export function BlogPostTable({ rows, paging, onPageChange, onRowPerPageChange }: BlogPostTableProps) {
  return (
    <BaseTable<FinalCell>
      rowsPerPageOptions={[2, 4, 8]}
      heads={headCells}
      rows={rows.map((r) => ({
        ...r,
        url: (
          <Link href={`${appClientConfig.PUBLIC_URL}/${r.blog.slug}/${r.slug}`}>
            <Chip label={`${appClientConfig.PUBLIC_URL}/${r.blog.slug}/${r.slug}`} variant="outlined" />
          </Link>
        ),
      }))}
      paging={paging}
      onPageChange={onPageChange}
      onRowPerPageChange={onRowPerPageChange}
    />
  );
}
