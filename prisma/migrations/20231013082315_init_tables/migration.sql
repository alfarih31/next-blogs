-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('BASIC');

-- CreateEnum
CREATE TYPE "BlogPostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'HIDE');

-- CreateEnum
CREATE TYPE "AttachmentProvider" AS ENUM ('VERCEL_BLOB');

-- CreateTable
CREATE TABLE "user_auth" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "authProvider" "AuthProvider" NOT NULL DEFAULT 'BASIC',
    "credentials" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog" (
    "id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_post" (
    "id" SERIAL NOT NULL,
    "blog_id" INTEGER NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "status" "BlogPostStatus" NOT NULL DEFAULT 'DRAFT',
    "content" TEXT NOT NULL,
    "metadata" JSON NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_header" (
    "blog_post_id" INTEGER NOT NULL,
    "background_attachment_id" INTEGER,
    "caption" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_header_pkey" PRIMARY KEY ("blog_post_id")
);

-- CreateTable
CREATE TABLE "attachment" (
    "id" SERIAL NOT NULL,
    "blog_id" INTEGER,
    "key" VARCHAR(511) NOT NULL,
    "filename" TEXT NOT NULL,
    "provider" "AttachmentProvider" NOT NULL DEFAULT 'VERCEL_BLOB',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_auth_username_key" ON "user_auth"("username");

-- CreateIndex
CREATE UNIQUE INDEX "blog_slug_key" ON "blog"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "blog_post_blog_id_slug_key" ON "blog_post"("blog_id", "slug");

-- AddForeignKey
ALTER TABLE "user_auth" ADD CONSTRAINT "user_auth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog" ADD CONSTRAINT "blog_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_post" ADD CONSTRAINT "blog_post_blog_id_fkey" FOREIGN KEY ("blog_id") REFERENCES "blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_header" ADD CONSTRAINT "blog_header_blog_post_id_fkey" FOREIGN KEY ("blog_post_id") REFERENCES "blog_post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_header" ADD CONSTRAINT "blog_header_background_attachment_id_fkey" FOREIGN KEY ("background_attachment_id") REFERENCES "attachment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_blog_id_fkey" FOREIGN KEY ("blog_id") REFERENCES "blog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
