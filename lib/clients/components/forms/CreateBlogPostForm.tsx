import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';
import { Button, Grid, IconButton, Paper, Stack, Typography } from '@mui/material';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useState } from 'react';
import { useUploadAttachmentMutation } from '$clients/api';
import { showSnackbar } from '$clients/stores/redux/actions';
import { styled } from '@mui/material/styles';
import { Add, Delete, Save } from '@mui/icons-material';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { BlogPostSectionForm } from './BlogPostSectionForm';

const section = (text: TemplateStringsArray, id: string): string => `section-${id}`;

const schema = z.intersection(
  z.record(z.string(), z.string().regex(/(^\w)|(<[^>]*>(.|\s)*\S(.|\s)*<\/[^>]*>)/g)),
  z.object({
    title: z.string().min(3),
  })
);

export type CreateBlogPostRequest = z.infer<typeof schema>;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

export type CreateBlogPostFormProps = {
  onSubmit: (params: CreateBlogPostRequest) => Promise<void>;
  blogId: number;
  disabled: boolean;
};

export function CreateBlogPostForm({ blogId, onSubmit, disabled }: CreateBlogPostFormProps) {
  const [sections, setSections] = useState([section`${nanoid(3)}`]);
  const formContext = useForm<CreateBlogPostRequest>({
    mode: 'onBlur',
    resolver: zodResolver(schema),
  });

  const [uploadAttachment] = useUploadAttachmentMutation();

  const handleEditorImageUpload = async (file: File) => {
    try {
      const { blob: newBlob, attachmentId } = await uploadAttachment({ blogId, file }).unwrap();

      return {
        data: {
          link: newBlob.url,
          attachmentId,
        },
      };
    } catch (err) {
      showSnackbar((err as Error).message, 'error');
      return {
        data: {
          link: '',
        },
      };
    }
  };

  const handleAddSection = () => {
    const newSectionId = section`${nanoid(3)}`;
    formContext.register(newSectionId);
    setSections([...sections, newSectionId]);
  };

  const handleDeleteSection = (sectionId: string) => {
    formContext.unregister(sectionId);

    const sectionIndex = sections.indexOf(sectionId);
    if (sectionIndex > -1) {
      sections.splice(sectionIndex, 1);
    }
  };

  return (
    <FormContainer formContext={formContext} onSuccess={onSubmit}>
      <Stack spacing={2}>
        <Item>
          <TextFieldElement
            name="title"
            label="Title"
            style={{ width: '100%' }}
            type="text"
            margin="normal"
            disabled={disabled}
          />
        </Item>
        {sections.map((id, idx) => (
          <Item key={id}>
            <span>
              <Typography variant="overline">Section {idx + 1}: </Typography>
              <IconButton
                color="secondary"
                onClick={() => handleDeleteSection(id)}
                aria-label="delete"
                size="small"
                disabled={disabled || idx === 0}
              >
                <Delete />
              </IconButton>
            </span>

            <BlogPostSectionForm<CreateBlogPostRequest>
              id={id}
              control={formContext.control}
              onImageUpload={handleEditorImageUpload}
              disabled={disabled}
            />
          </Item>
        ))}
        <Grid container justifyContent="center" direction="row">
          <Grid item xs={6} sx={{ paddingRight: '0.5rem' }}>
            <Button
              style={{ width: '100%' }}
              variant="outlined"
              endIcon={<Add />}
              onClick={handleAddSection}
              disabled={disabled}
            >
              Add Section
            </Button>
          </Grid>

          <Grid item xs={6} sx={{ paddingLeft: '0.5rem' }}>
            <Button style={{ width: '100%' }} variant="contained" endIcon={<Save />} type="submit" disabled={disabled}>
              Publish
            </Button>
          </Grid>
        </Grid>
      </Stack>
    </FormContainer>
  );
}
