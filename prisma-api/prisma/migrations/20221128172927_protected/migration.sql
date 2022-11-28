-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChatRoom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_dm" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "is_protected" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT
);
INSERT INTO "new_ChatRoom" ("createdAt", "id", "is_dm", "is_public", "name", "password") SELECT "createdAt", "id", "is_dm", "is_public", "name", "password" FROM "ChatRoom";
DROP TABLE "ChatRoom";
ALTER TABLE "new_ChatRoom" RENAME TO "ChatRoom";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
