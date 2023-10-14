import z from 'zod';

const schema = z.object({
  BCRYPT_SALT_ROUNDS: z.number().min(1),
});

export const authServerConfig: z.infer<typeof schema> = schema.parse({
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
});
