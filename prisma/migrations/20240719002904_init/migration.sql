/*
  Warnings:

  - You are about to drop the column `liveScoreId` on the `Team` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[liveScoreURL]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `liveScoreURL` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Team_name_key` ON `Team`;

-- AlterTable
ALTER TABLE `Team` DROP COLUMN `liveScoreId`,
    ADD COLUMN `liveScoreURL` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Team_liveScoreURL_key` ON `Team`(`liveScoreURL`);
