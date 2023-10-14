import { useState } from 'react';
import { EditorState } from 'draft-js';
import dynamic from 'next/dynamic';
import { EditorProps } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import { Control, Controller, FieldPath } from 'react-hook-form';

const Editor = dynamic<EditorProps>(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), { ssr: false });

export type BlogPostSectionFormProps<TFieldValues extends Record<string, string>> = {
  id: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  onImageUpload: (file: File) => Promise<{ data: { link: string } }>;
  disabled: boolean;
};

export function BlogPostSectionForm<TFieldValues extends Record<string, string>>({
  id,
  onImageUpload,
  control,
  disabled,
}: BlogPostSectionFormProps<TFieldValues>) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  return (
    <Controller
      name={id}
      control={control}
      disabled={disabled}
      render={({ field: { onChange, onBlur }, fieldState: { error, invalid } }) => (
        <Editor
          onBlur={onBlur}
          onChange={(state) => onChange(draftToHtml(state))}
          editorStyle={{ padding: '0 1rem' }}
          wrapperStyle={{
            border: `1px solid ${invalid || !!error ? 'red' : 'black'}`,
          }}
          editorState={editorState}
          onEditorStateChange={setEditorState}
          toolbar={{
            options: [
              'inline',
              'blockType',
              'fontSize',
              'fontFamily',
              'list',
              'textAlign',
              'colorPicker',
              'link',
              'embedded',
              'emoji',
              'image',
              'history',
            ],
            inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: true },
            image: {
              urlEnabled: true,
              uploadEnabled: true,
              uploadCallback: onImageUpload,
              previewImage: true,
              alt: { present: false, mandatory: false },
            },
          }}
        />
      )}
    />
  );
}
