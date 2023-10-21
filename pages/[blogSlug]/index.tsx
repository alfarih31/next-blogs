import { Button, Divider, List, ListItem, ListItemButton, ListItemText, Pagination, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useListPublicBlogPostsQuery } from '$clients/api';
import { useRouter } from 'next/router';
import PageLoader from '$clients/components/PageLoader';
import { Home, Pages } from '@mui/icons-material';
import Link from 'next/link';
import { StyledContainer } from '$clients/components/StyledContainer';
import { StyledBox } from '$clients/components/StyledBox';

const StyledList = styled(List)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));



export default function BlogPosts() {
  const router = useRouter();
  const { blogSlug } = router.query;
  const [paging, setPaging] = useState({
    page: 0,
    rowsPerPage: 5,
    totalRows: 0,
  });
  const { data, isLoading, isFetching, error, isError } = useListPublicBlogPostsQuery({
    blogSlug: blogSlug as string,
    page: paging.page,
    rowsPerPage: paging.rowsPerPage,
  });

  useEffect(() => {
    if (!(isLoading && isFetching) && !!data) {
      setPaging({ ...paging, totalRows: data.data.totalRows });
    }
  }, [data]);

  if(isError && error) {
    throw error
  }
  if (!data) {
    return <PageLoader />;
  }

  const isEmpty = !(isLoading && isFetching) && data.data.rows.length === 0

  return (
    <StyledBox>
      <StyledContainer>
        <Link href="/" as="/">
          <Button startIcon={<Home />}>Back to home</Button>
        </Link>
        <section className="FlexContainer--TopLeft">
          <Typography variant="h4">{data.data.metadata!.blog.name}</Typography>
          <Typography sx={{marginLeft: '0.5rem'}} variant="caption">posts<Pages fontSize="small"/></Typography>
        </section>

        <Typography style={{marginLeft: '1rem'}} variant="caption">{data.data.metadata!.blog.authorName}</Typography>

        <StyledList>
          {isEmpty && (
              <ListItem>
                <Typography sx={{margin: 'auto'}} variant="overline">No blog post here</Typography>
              </ListItem>
          )}
          {data &&
            data.data.rows.map((r) => (
              <>
                <ListItemButton key={r.slug} alignItems="flex-start" component="a" href={`/${blogSlug}/${r.slug}`}>
                  <ListItemText
                    primary={r.title}
                    secondary={
                      <Typography sx={{ display: 'inline' }} component="span" variant="caption" color="text.primary">
                        {`Created on: ${r.createdAt}`}
                      </Typography>
                    }
                  />
                </ListItemButton>
                <Divider />
              </>
            ))}
          <ListItem>
            <Pagination
              sx={{ marginLeft: 'auto', display: isEmpty ? "none": "inherit" }}
              count={Math.floor(paging.totalRows / paging.rowsPerPage)}
              page={paging.page + 1}
              color="primary"
              onChange={(e, page) => setPaging({ ...paging, page: page - 1 })}
              showFirstButton
              showLastButton
            />
          </ListItem>
        </StyledList>
      </StyledContainer>
    </StyledBox>
  );
}
