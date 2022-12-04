-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Permission" (
    "statusMember" TEXT NOT NULL,
    "is_banned" BOOLEAN NOT NULL DEFAULT false,
    "is_muted" BOOLEAN NOT NULL DEFAULT false,
    "muted_since" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER,
    "playerId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,

    PRIMARY KEY ("playerId", "roomId"),
    CONSTRAINT "Permission_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Permission_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Permission" ("duration", "is_banned", "is_muted", "muted_since", "playerId", "roomId", "statusMember") SELECT "duration", "is_banned", "is_muted", "muted_since", "playerId", "roomId", "statusMember" FROM "Permission";
DROP TABLE "Permission";
ALTER TABLE "new_Permission" RENAME TO "Permission";
CREATE UNIQUE INDEX "Permission_playerId_roomId_key" ON "Permission"("playerId", "roomId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
