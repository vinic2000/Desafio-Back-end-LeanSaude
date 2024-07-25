/*
  Warnings:

  - Added the required column `error` to the `log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "log" ADD COLUMN     "error" TEXT NOT NULL;
