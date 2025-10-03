-- AlterTable
ALTER TABLE "public"."RoomMember" ADD COLUMN     "chatId" SERIAL NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."RoomMember" ADD CONSTRAINT "RoomMember_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
