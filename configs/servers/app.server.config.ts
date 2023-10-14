import z from 'zod';

const schema = z.object({
  ENCRYPT_SECRET: z.string().min(32).max(32),
  VERCEL_BLOB_RW_TOKEN: z.string().min(12),
});

export const appServerConfig: z.infer<typeof schema> = schema.parse({
  ENCRYPT_SECRET: process.env.ENCRYPT_SECRET,
  VERCEL_BLOB_RW_TOKEN: process.env.VERCEL_BLOB_RW_TOKEN,
});
