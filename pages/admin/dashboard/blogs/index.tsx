import { useCreateBlogMutation, useListBlogQuery } from '$clients/api';
import { Box, Button, Card, CardContent, Modal, Paper } from '@mui/material';
import { BlogTable } from '$clients/components/tables';
import { useEffect, useState } from 'react';
import PageLoader from '$clients/components/PageLoader';
import { CreateBlogForm } from '$clients/components/forms';
import { Add } from '@mui/icons-material';
import { showSnackbar } from '$clients/stores/redux/actions';
import { useRouter } from 'next/router';

export default function Blogs() {
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [paging, setPaging] = useState({
    page: 0,
    rowsPerPage: 2,
    totalRows: 0,
  });
  const { data, isLoading, isFetching } = useListBlogQuery({
    page: paging.page,
    rowsPerPage: paging.rowsPerPage,
  });
  const [createBlog, { isLoading: createIsLoading }] = useCreateBlogMutation();

  const goToBlogPostList = async (blogId: number) => {
    await router.push(`/admin/dashboard/blogs/:id`, `/admin/dashboard/blogs/${blogId}`, { shallow: true });
  };

  const toggleShowCreateForm = () => setShowCreateForm(!showCreateForm);

  useEffect(() => {
    if (!(isLoading && isFetching) && !!data) {
      setPaging({ ...paging, totalRows: data.data.totalRows });
    }
  }, [data]);

  return (
    <>
      {(isLoading || isFetching || createIsLoading) && <PageLoader />}
      <Modal open={showCreateForm} onClose={toggleShowCreateForm}>
        <Card
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'fit-content',
            padding: '0.5rem',
          }}
        >
          <CardContent>
            <CreateBlogForm
              onSubmit={async (blog) =>
                createBlog(blog)
                  .then(toggleShowCreateForm)
                  .then(() => showSnackbar('New blog successfully created!'))
              }
              disabled={createIsLoading}
            />
          </CardContent>
        </Card>
      </Modal>
      <Box sx={{ width: '100%', height: '100%' }}>
        <Paper sx={{ width: '100%', height: '100%' }}>
          <div className="FlexContainer--MiddleRight">
            <Button
              style={{ margin: '1rem' }}
              variant="outlined"
              startIcon={<Add />}
              onClick={() => setShowCreateForm(true)}
            >
              Create Blog
            </Button>
          </div>

          <BlogTable
            rows={data ? data.data.rows : []}
            paging={paging}
            onClickRow={goToBlogPostList}
            onPageChange={async (newPage) => setPaging({ ...paging, page: newPage })}
            onRowPerPageChange={async (newRowPerPage) => setPaging({ ...paging, rowsPerPage: newRowPerPage })}
          />
        </Paper>
      </Box>
    </>
  );
}
