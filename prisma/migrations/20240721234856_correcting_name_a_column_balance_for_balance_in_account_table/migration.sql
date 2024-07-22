/*
  Warnings:

  - You are about to drop the column `Balance` on the `Account` table. All the data in the column will be lost.
  - Added the required column `balance` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "Balance",
ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL;
