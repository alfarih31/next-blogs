import { useListBlogPostsQuery } from '$clients/api';
import { Box, Button, Paper } from '@mui/material';
import { BlogPostTable } from '$clients/components/tables';
import { useEffect, useState } from 'react';
import PageLoader from '$clients/components/PageLoader';
import { useRouter } from 'next/router';
import { Add } from '@mui/icons-material';
import Link from 'next/link';

export default function BlogPosts() {
  const router = useRouter();
  const blogId = Number.parseInt(router.query.id as string, 10);
  const [paging, setPaging] = useState({
    page: 0,
    rowsPerPage: 2,
    totalRows: 0,
  });

  const { data, isLoading, isFetching } = useListBlogPostsQuery({
    blogId,
    page: paging.page,
    rowsPerPage: paging.rowsPerPage,
  });

  useEffect(() => {
    if (!(isLoading && isFetching) && !!data) {
      setPaging({ ...paging, totalRows: data.data.totalRows });
    }
  }, [data]);

  return (
    <>
      {(isLoading || isFetching) && <PageLoader />}
      <Box sx={{ width: '100%', height: '100%' }}>
        <Paper sx={{ width: '100%', height: '100%' }}>
          <div className="FlexContainer--MiddleRight">
            <Link as={`${router.asPath}/create`} href={`${router.pathname}/create`}>
              <Button style={{ margin: '1rem' }} variant="outlined" startIcon={<Add />}>
                Add Post
              </Button>
            </Link>
          </div>
          <BlogPostTable
            rows={data ? data.data.rows : []}
            paging={paging}
            onPageChange={async (newPage) => setPaging({ ...paging, page: newPage })}
            onRowPerPageChange={async (newRowPerPage) => setPaging({ ...paging, rowsPerPage: newRowPerPage })}
          />
        </Paper>
      </Box>
    </>
  );
}
