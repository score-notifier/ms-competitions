-- DropForeignKey
ALTER TABLE `Match` DROP FOREIGN KEY `Match_awayTeamId_fkey`;

-- DropForeignKey
ALTER TABLE `Match` DROP FOREIGN KEY `Match_homeTeamId_fkey`;

-- AlterTable
ALTER TABLE `Match` MODIFY `homeTeamId` VARCHAR(191) NULL,
    MODIFY `awayTeamId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Match` ADD CONSTRAINT `Match_homeTeamId_fkey` FOREIGN KEY (`homeTeamId`) REFERENCES `Team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Match` ADD CONSTRAINT `Match_awayTeamId_fkey` FOREIGN KEY (`awayTeamId`) REFERENCES `Team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
