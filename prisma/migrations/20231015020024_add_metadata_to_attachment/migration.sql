-- AlterTable
ALTER TABLE "attachment" ADD COLUMN     "metadata" JSON NOT NULL DEFAULT '{}';
