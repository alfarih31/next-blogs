import { RegisterForm, RegisterFormProps } from '$clients/components/forms';
import { Button } from '@mui/material';
import { useRegisterMutation } from '$clients/api';
import { loginPath } from '$configs/clients/route.client.config';
import { showSnackbar } from '$clients/stores/redux/actions';
import Router from 'next/router';

export default function RegisterPage() {
  const [register, { isLoading, isSuccess, isError, error }] = useRegisterMutation();

  if (isError && error) {
    showSnackbar(error.toString(), 'error');
  }

  if (isSuccess) {
    Router.replace({ pathname: loginPath }, undefined, { shallow: true }).then(() =>
      showSnackbar('Registration success..')
    );
  }

  const onSubmit: RegisterFormProps['onSubmit'] = async (request) => {
    try {
      await register(request);
    } catch (err) {
      showSnackbar((err as Error).message, 'error');
    }
  };
  return (
    <div className="FlexContainer--Center--Col" style={{ padding: '1rem' }}>
      <RegisterForm onSubmit={onSubmit} disabled={isLoading} />

      <Button href={loginPath} variant="text" disabled={isLoading}>
        Already have an account? Log in
      </Button>
    </div>
  );
}
