import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';

export const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    width: '90%',
  },
  [theme.breakpoints.up('sm')]: {
    width: '40%',
  },
}));
