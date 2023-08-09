/*
  Warnings:

  - Added the required column `file1_path` to the `Files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file2_path` to the `Files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file3_path` to the `Files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Files" ADD COLUMN     "file1_path" TEXT NOT NULL,
ADD COLUMN     "file2_path" TEXT NOT NULL,
ADD COLUMN     "file3_path" TEXT NOT NULL,
ALTER COLUMN "link_zoom" DROP NOT NULL;
