import {
  Box,
  Button,
  Container,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Pagination,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useListPublicBlogPostsQuery } from '$clients/api';
import { useRouter } from 'next/router';
import PageLoader from '$clients/components/PageLoader';
import { Home } from '@mui/icons-material';
import Link from 'next/link';

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey.A200,
  ...theme.typography.body2,
  height: '100vh',
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const StyledList = styled(List)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '90%',
  },
  [theme.breakpoints.up('sm')]: {
    width: '40%',
  },
}));

export default function BlogPosts() {
  const router = useRouter();
  const { blogSlug } = router.query;
  const [paging, setPaging] = useState({
    page: 0,
    rowsPerPage: 5,
    totalRows: 0,
  });
  const { data, isLoading, isFetching } = useListPublicBlogPostsQuery({
    blogSlug: blogSlug as string,
    page: paging.page,
    rowsPerPage: paging.rowsPerPage,
  });

  useEffect(() => {
    if (!(isLoading && isFetching) && !!data) {
      setPaging({ ...paging, totalRows: data.data.totalRows });
    }
  }, [data]);

  if (!data) {
    return <PageLoader />;
  }
  return (
    <StyledBox>
      <StyledContainer>
        <Link href="/" as="/">
          <Button startIcon={<Home />}>Back to home</Button>
        </Link>
        <Typography variant="h4">{data.data.metadata!.blog.name}</Typography>
        <Typography variant="caption">{data.data.metadata!.blog.authorName}</Typography>

        <StyledList>
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
              sx={{ marginLeft: 'auto' }}
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
