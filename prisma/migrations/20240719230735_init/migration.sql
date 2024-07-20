/*
  Warnings:

  - You are about to drop the column `url` on the `League` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[liveScoreURL]` on the table `League` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `liveScoreURL` to the `League` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `League_url_key` ON `League`;

-- AlterTable
ALTER TABLE `League` DROP COLUMN `url`,
    ADD COLUMN `liveScoreURL` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `League_liveScoreURL_key` ON `League`(`liveScoreURL`);
