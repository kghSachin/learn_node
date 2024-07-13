/*
  Warnings:

  - Made the column `title` on table `Notice` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Notice" ADD COLUMN     "body" TEXT,
ALTER COLUMN "title" SET NOT NULL;
