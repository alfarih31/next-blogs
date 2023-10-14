import { $Enums, PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();
const enums = $Enums;

export { prismaClient, enums };
