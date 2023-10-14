export const authConfig = {
  BCRYPT_SALT_ROUNDS: Number.parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
};
