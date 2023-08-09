/*
  Warnings:

  - Added the required column `createdBy` to the `Files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link_zoom` to the `Files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Files" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "link_zoom" TEXT NOT NULL;
