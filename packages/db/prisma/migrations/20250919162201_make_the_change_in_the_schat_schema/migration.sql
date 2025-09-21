/*
  Warnings:

  - You are about to drop the column `message` on the `Chat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Chat" DROP COLUMN "message",
ADD COLUMN     "content" JSONB[];
