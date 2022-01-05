-- CreateTable
CREATE TABLE `Data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `station_id` VARCHAR(191) NOT NULL,
    `lng` DOUBLE NOT NULL,
    `lat` DOUBLE NOT NULL,
    `ppm` DOUBLE NOT NULL,
    `co_ppm` DOUBLE NOT NULL,
    `co2_ppm` DOUBLE NOT NULL,
    `alkol_ppm` DOUBLE NOT NULL,
    `aseton_ppm` DOUBLE NOT NULL,
    `temperature` DOUBLE NOT NULL,
    `humidity` DOUBLE NOT NULL,
    `heat_index` DOUBLE NOT NULL,
    `pressure` DOUBLE NOT NULL,
    `altitude` DOUBLE NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Station` (
    `id` VARCHAR(191) NOT NULL,
    `lng` DOUBLE NOT NULL,
    `lat` DOUBLE NOT NULL,

    UNIQUE INDEX `Station_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Data` ADD CONSTRAINT `Data_station_id_fkey` FOREIGN KEY (`station_id`) REFERENCES `Station`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
