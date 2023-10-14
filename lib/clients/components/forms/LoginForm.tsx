import { Button, Card, CardActions, CardContent, IconButton, InputAdornment, Typography } from '@mui/material';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';

const registerSchema = z.object({
  username: z.string().email(),
  password: z.string().min(8),
});

export type LoginRequest = z.infer<typeof registerSchema>;

export type LoginFormProps = {
  onSubmit: (request: LoginRequest) => Promise<any>;
  disabled?: boolean;
};

export function LoginForm({ onSubmit, disabled }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <FormContainer mode="onBlur" resolver={zodResolver(registerSchema)} onSuccess={onSubmit}>
      <Card>
        <CardContent>
          <Typography variant="h5">Login</Typography>
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
        </CardContent>
        <CardActions>
          <Button type="submit" disabled={disabled}>
            Login
          </Button>
        </CardActions>
      </Card>
    </FormContainer>
  );
}

LoginForm.defaultProps = {
  disabled: false,
};
