import { Button, Container, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { usePublicBlogPostDetailQuery } from '$clients/api';
import { useRouter } from 'next/router';
import PageLoader from '$clients/components/PageLoader';
import { StyledBox } from '$clients/components/StyledBox';
import { ArrowBack, LocalLibrary, Pages } from '@mui/icons-material';
import Link from 'next/link';
import { nanoid } from 'nanoid';

const StyledPaper = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
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
      <Container>
        <Link href="/:blogSlug" as={`/${blogSlug}`}>
          <Button startIcon={<ArrowBack />}>Back to posts</Button>
        </Link>
        <section className="FlexContainer--TopLeft">
          <Typography variant="h3">{data.data.title}</Typography>
          <LocalLibrary/>
        </section>

        <section style={{marginLeft: '1rem'}} className="FlexContainer--TopLeft">
          <Typography variant="h5">{data.data.blog.name}</Typography>
          <Pages fontSize="small"/>
        </section>


        <Typography style={{marginLeft: '1rem'}} variant="caption">{data.data.blog.authorName}</Typography>

        <StyledPaper>
          {data.data.sections.map((section) => (
            <article key={nanoid(3)} dangerouslySetInnerHTML={{ __html: section }} />
          ))}
        </StyledPaper>
      </Container>
    </StyledBox>
  );
}
