import { Button } from '@mui/material';
import { useLoginMutation } from '$clients/api';
import { showSnackbar } from '$clients/stores/redux/actions';
import Router from 'next/router';
import { homePath } from '$configs/route.config';
import { LoginForm } from '$clients/components/forms';

export default function LoginPage() {
  const [login, { isLoading, isError, error, isSuccess }] = useLoginMutation();

  if (isError && error) {
    showSnackbar(error.toString(), 'error');
  }

  if (isSuccess) {
    Router.replace({ pathname: homePath }, undefined, { shallow: true }).then(() => showSnackbar('Logged in...'));
  }

  return (
    <div className="FlexContainer--Center--Col" style={{ padding: '1rem' }}>
      <LoginForm onSubmit={login} />
      <Button href="/register" variant="text" disabled={isLoading}>
        Don't have an account yet? Create one
      </Button>
    </div>
  );
}
