/*
  Warnings:

  - You are about to drop the column `file_name` on the `Files` table. All the data in the column will be lost.
  - Added the required column `file1_name` to the `Files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file2_name` to the `Files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file3_name` to the `Files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Files" DROP COLUMN "file_name",
ADD COLUMN     "file1_name" TEXT NOT NULL,
ADD COLUMN     "file2_name" TEXT NOT NULL,
ADD COLUMN     "file3_name" TEXT NOT NULL;
