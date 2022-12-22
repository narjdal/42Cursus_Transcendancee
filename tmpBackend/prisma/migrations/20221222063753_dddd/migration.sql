/*
  Warnings:

  - The values [MemberDhonneur] on the enum `achievementsName` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "achievementsName_new" AS ENUM ('Bono', 'CleanSheet', 'Ziyech', 'hamdallah');
ALTER TYPE "achievementsName" RENAME TO "achievementsName_old";
ALTER TYPE "achievementsName_new" RENAME TO "achievementsName";
DROP TYPE "achievementsName_old";
COMMIT;
