import { Box, IconButton } from '@mui/material';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useRouter } from 'next/router';
import { CreateBlogPostForm, CreateBlogPostFormProps } from '$clients/components/forms';
import { useCreateBlogPostMutation } from '$clients/api';
import { showSnackbar } from '$clients/stores/redux/actions';
import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';

export default function CreateBlogPost() {
  const router = useRouter();
  const blogId = Number.parseInt(router.query.id as string, 10);
  const [createBlogPost, { isLoading }] = useCreateBlogPostMutation();

  const handleSubmit: CreateBlogPostFormProps['onSubmit'] = async (params) => {
    const { title, ...sections } = params;

    try {
      await createBlogPost({ blogId, title, sections: Object.values(sections) });
      router
        .push(`/admin/dashboard/blogs/:id`, `/admin/dashboard/blogs/${blogId}`)
        .then(() => showSnackbar('New post successfully published!'));
    } catch (err) {
      showSnackbar((err as Error).message, 'error');
    }
  };

  return (
    <Box>
      <Link href="/admin/dashboard/blogs/:id" as={`/admin/dashboard/blogs/${blogId}`}>
        <IconButton size="large">
          <ArrowBack />
        </IconButton>
      </Link>

      <CreateBlogPostForm blogId={blogId} onSubmit={handleSubmit} disabled={isLoading} />
    </Box>
  );
}
