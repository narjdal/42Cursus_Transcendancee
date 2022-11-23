-- CreateTable
CREATE TABLE "ChatRoom" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_dm" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "password" TEXT
);

-- CreateTable
CREATE TABLE "Permission" (
    "statusMember" TEXT NOT NULL,
    "is_banned" BOOLEAN NOT NULL DEFAULT false,
    "is_muted" BOOLEAN NOT NULL DEFAULT false,
    "muted_until" DATETIME NOT NULL,
    "playerId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,

    PRIMARY KEY ("playerId", "roomId"),
    CONSTRAINT "Permission_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Permission_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playerId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "msg" TEXT NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
