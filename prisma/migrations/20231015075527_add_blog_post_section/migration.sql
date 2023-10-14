/*
  Warnings:

  - You are about to drop the column `content` on the `blog_post` table. All the data in the column will be lost.
  - You are about to drop the `blog_header` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "blog_header" DROP CONSTRAINT "blog_header_background_attachment_id_fkey";

-- DropForeignKey
ALTER TABLE "blog_header" DROP CONSTRAINT "blog_header_blog_post_id_fkey";

-- AlterTable
ALTER TABLE "blog_post" DROP COLUMN "content";

-- DropTable
DROP TABLE "blog_header";

-- CreateTable
CREATE TABLE "blog_post_section" (
    "id" SERIAL NOT NULL,
    "blog_post_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_post_section_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "blog_post_section" ADD CONSTRAINT "blog_post_section_blog_post_id_fkey" FOREIGN KEY ("blog_post_id") REFERENCES "blog_post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
