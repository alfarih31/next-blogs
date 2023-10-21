import { Box, Divider, List, ListItem, ListItemButton, ListItemText, Pagination, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useListPublicBlogQuery } from '$clients/api';
import { StyledContainer } from '$clients/components/StyledContainer';
import PageLoader from '$clients/components/PageLoader';
import { AdsClick, Groups } from '@mui/icons-material';
import { dashboardPath } from '$configs/clients/route.client.config';

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

  if (!data) {
    return <PageLoader />;
  }

  const isEmpty = !(isLoading && isFetching) && data.data.rows.length === 0

  return (
    <StyledBox>
      <StyledContainer>

        <section className="FlexContainer--TopLeft">
          <Typography variant="h3">PEOPLE BLOGS</Typography>
          <Groups sx={{marginLeft: '1rem'}}/>
        </section>


        <StyledList>
          {isEmpty && (
              <>
                <ListItem>
                  <Typography sx={{margin: 'auto'}} variant="overline">No one writes a blog</Typography>

                </ListItem>
                <ListItemButton href={dashboardPath}>
                  <Typography sx={{margin: 'auto'}} variant="h6">You can create yours here! <AdsClick/></Typography>
                </ListItemButton>
              </>

          )}

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

export default Home;
