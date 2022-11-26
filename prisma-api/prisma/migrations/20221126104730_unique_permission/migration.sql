/*
  Warnings:

  - A unique constraint covering the columns `[playerId,roomId]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Permission_playerId_roomId_key" ON "Permission"("playerId", "roomId");
