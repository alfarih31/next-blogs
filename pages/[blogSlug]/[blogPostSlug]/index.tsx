import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { usePublicBlogPostDetailQuery } from '$clients/api';
import { useRouter } from 'next/router';
import PageLoader from '$clients/components/PageLoader';
import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import { nanoid } from 'nanoid';

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey.A200,
  ...theme.typography.body2,
  height: '100vh',
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

export default function BlogPosts() {
  const router = useRouter();
  const { blogSlug, blogPostSlug } = router.query;
  const { data, isLoading, isFetching } = usePublicBlogPostDetailQuery({
    blogSlug: blogSlug as string,
    blogPostSlug: blogPostSlug as string,
  });

  if (!data || isLoading || isFetching) {
    return <PageLoader />;
  }

  return (
    <StyledBox>
      <Container maxWidth="sm">
        <Link href="/:blogSlug" as={`/${blogSlug}`}>
          <Button startIcon={<ArrowBack />}>Back to posts</Button>
        </Link>
        <Typography variant="h3">{data.data.title}</Typography>
        <Typography variant="subtitle2">{data.data.blog.name}</Typography>
        <Typography variant="subtitle1">{data.data.blog.authorName}</Typography>

        <StyledPaper className="FlexContainer--Center--Col">
          {data.data.sections.map((section) => (
            <article key={nanoid(3)} dangerouslySetInnerHTML={{ __html: section }} />
          ))}
        </StyledPaper>
      </Container>
    </StyledBox>
  );
}
