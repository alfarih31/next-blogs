import { RegisterForm } from '$clients/components/forms';
import { Button } from '@mui/material';
import { useRegisterMutation } from '$clients/api';
import { loginPath } from '$configs/route.config';

export default function RegisterPage() {
  const [register, { isLoading }] = useRegisterMutation();

  return (
    <div className="FlexContainer--Center--Col" style={{ padding: '1rem' }}>
      <RegisterForm onSubmit={register} />

      <Button href={loginPath} variant="text" disabled={isLoading}>
        Already have an account? Log in
      </Button>
    </div>
  );
}
