/*
  Warnings:

  - You are about to drop the column `chatId` on the `RoomMember` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."RoomMember" DROP CONSTRAINT "RoomMember_chatId_fkey";

-- AlterTable
ALTER TABLE "public"."RoomMember" DROP COLUMN "chatId";
