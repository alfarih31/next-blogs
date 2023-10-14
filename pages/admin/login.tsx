import { Button } from '@mui/material';
import { useLoginMutation } from '$clients/api';
import { showSnackbar } from '$clients/stores/redux/actions';
import Router from 'next/router';
import { homePath } from '$configs/clients/route.client.config';
import { LoginForm, LoginFormProps } from '$clients/components/forms';

export default function LoginPage() {
  const [login, { isLoading, isError, error, isSuccess }] = useLoginMutation();

  if (isError && error) {
    showSnackbar(error.toString(), 'error');
  }

  if (isSuccess) {
    Router.replace({ pathname: homePath }, undefined, { shallow: true }).then(() => showSnackbar('Logged in...'));
  }

  const onSubmit: LoginFormProps['onSubmit'] = async (request) => {
    try {
      await login(request);
    } catch (err) {
      showSnackbar((err as Error).message, 'error');
    }
  };

  return (
    <div className="FlexContainer--Center--Col" style={{ padding: '1rem' }}>
      <LoginForm onSubmit={onSubmit} disabled={isLoading} />
      <Button href="/admin/register" variant="text" disabled={isLoading}>
        Don&lsquo;t have an account yet? Create one
      </Button>
    </div>
  );
}
