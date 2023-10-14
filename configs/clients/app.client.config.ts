import z from 'zod';

const schema = z.object({
  APP_NAME: z.string(),
  PUBLIC_URL: z.string().url(),
});

export const appClientConfig: z.infer<typeof schema> = schema.parse({
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  PUBLIC_URL: process.env.NEXT_PUBLIC_PUBLIC_URL,
});
