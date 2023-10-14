import { Chip, IconButton, InputAdornment, Typography } from '@mui/material';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { appClientConfig } from '$configs/clients/app.client.config';
import slugify from 'slugify';
import { Add } from '@mui/icons-material';

const schema = z.object({
  name: z.string().min(3),
});

export type CreateBlogRequest = z.infer<typeof schema>;

export type CreateBlogFormProps = {
  onSubmit: (request: CreateBlogRequest) => Promise<void>;
  disabled?: boolean;
};

export function CreateBlogForm({ onSubmit, disabled }: CreateBlogFormProps) {
  const formContext = useForm<{
    name: string;
  }>({
    mode: 'onBlur',
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
    },
  });

  const name = formContext.watch('name');

  return (
    <FormContainer formContext={formContext} onSuccess={onSubmit}>
      <Typography variant="h6">Create Blog</Typography>
      <TextFieldElement
        name="name"
        label="Name"
        style={{ width: '100%' }}
        type="text"
        margin="normal"
        disabled={disabled}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => formContext.handleSubmit(onSubmit)()}
                disabled={disabled}
                aria-label="toggle password visibility"
                edge="end"
              >
                <Add />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <span>
        <Typography variant="subtitle2">Your url: </Typography>
        <Chip label={`${appClientConfig.PUBLIC_URL || '/'}${slugify(name, { lower: true })}`} variant="outlined" />
      </span>
    </FormContainer>
  );
}

CreateBlogForm.defaultProps = {
  disabled: false,
};
