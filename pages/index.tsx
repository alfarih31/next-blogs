import { Box, Container, Divider, List, ListItemButton, ListItemText, Pagination, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useListPublicBlogQuery } from '$clients/api';

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

function Home() {
  const [paging, setPaging] = useState({
    page: 0,
    rowsPerPage: 5,
    totalRows: 0,
  });
  const { data, isLoading, isFetching } = useListPublicBlogQuery({
    page: paging.page,
    rowsPerPage: paging.rowsPerPage,
  });

  useEffect(() => {
    if (!(isLoading && isFetching) && !!data) {
      setPaging({ ...paging, totalRows: data.data.totalRows });
    }
  }, [data]);

  return (
    <StyledBox>
      <StyledContainer>
        <Typography variant="h2">Our blogs</Typography>

        <StyledList>
          {data &&
            data.data.rows.map((r) => (
              <>
                <ListItemButton key={r.slug} alignItems="flex-start" component="a" href={`/${r.slug}`}>
                  <ListItemText
                    primary={r.name}
                    secondary={
                      <Typography sx={{ display: 'inline' }} component="span" variant="caption" color="text.primary">
                        {` ${r.authorName}`}
                      </Typography>
                    }
                  />
                </ListItemButton>
                <Divider />
              </>
            ))}
          <Pagination
            count={Math.floor(paging.totalRows / paging.rowsPerPage)}
            page={paging.page + 1}
            color="primary"
            onChange={(e, page) => setPaging({ ...paging, page: page - 1 })}
            showFirstButton
            showLastButton
          />
        </StyledList>
      </StyledContainer>
    </StyledBox>
  );
}

export default Home;
