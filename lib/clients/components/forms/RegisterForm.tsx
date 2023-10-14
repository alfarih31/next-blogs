import { Button, Card, CardActions, CardContent, IconButton, InputAdornment, Typography } from '@mui/material';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const registerSchema = z.object({
  username: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
});

export type RegisterRequest = z.infer<typeof registerSchema>;

export type RegisterFormProps = {
  onSubmit: (request: RegisterRequest) => Promise<any>;
  disabled?: boolean;
};

export function RegisterForm({ onSubmit, disabled }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <FormContainer mode="onBlur" resolver={zodResolver(registerSchema)} onSuccess={onSubmit}>
      <Card>
        <CardContent>
          <Typography variant="h5">Register</Typography>
          <Typography variant="h6">Welcome</Typography>
          <TextFieldElement name="username" label="Email" style={{ width: '100%' }} margin="normal" />
          <TextFieldElement
            name="password"
            label="Password"
            style={{ width: '100%' }}
            type={showPassword ? 'text' : 'password'}
            margin="normal"
            disabled={disabled}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={toggleShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextFieldElement name="fullName" label="Full name" style={{ width: '100%' }} margin="normal" />
        </CardContent>
        <CardActions>
          <Button type="submit" disabled={disabled}>
            Register
          </Button>
        </CardActions>
      </Card>
    </FormContainer>
  );
}

RegisterForm.defaultProps = {
  disabled: false,
};
