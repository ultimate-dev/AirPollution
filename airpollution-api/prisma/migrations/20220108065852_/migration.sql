/*
  Warnings:

  - You are about to drop the column `lat` on the `Station` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `Station` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Station` DROP COLUMN `lat`,
    DROP COLUMN `lng`,
    ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT true;
