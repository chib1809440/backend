/*
  Warnings:

  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `currency` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `previousStatus` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `Order` table. All the data in the column will be lost.
  - The primary key for the `OutboxEvent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `aggregateId` on the `OutboxEvent` table. All the data in the column will be lost.
  - You are about to drop the column `aggregateType` on the `OutboxEvent` table. All the data in the column will be lost.
  - You are about to drop the column `eventVersion` on the `OutboxEvent` table. All the data in the column will be lost.
  - You are about to drop the column `lastError` on the `OutboxEvent` table. All the data in the column will be lost.
  - You are about to drop the column `retryCount` on the `OutboxEvent` table. All the data in the column will be lost.
  - Changed the type of `status` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `OutboxEvent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "OutboxEvent" DROP CONSTRAINT "OutboxEvent_aggregateId_fkey";

-- DropIndex
DROP INDEX "Order_status_idx";

-- DropIndex
DROP INDEX "Order_userId_idx";

-- DropIndex
DROP INDEX "OutboxEvent_aggregateType_aggregateId_idx";

-- DropIndex
DROP INDEX "OutboxEvent_status_createdAt_idx";

-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
DROP COLUMN "currency",
DROP COLUMN "previousStatus",
DROP COLUMN "totalAmount",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
DROP COLUMN "version",
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL,
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "OutboxEvent" DROP CONSTRAINT "OutboxEvent_pkey",
DROP COLUMN "aggregateId",
DROP COLUMN "aggregateType",
DROP COLUMN "eventVersion",
DROP COLUMN "lastError",
DROP COLUMN "retryCount",
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL,
ADD CONSTRAINT "OutboxEvent_pkey" PRIMARY KEY ("id");

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "OutboxStatus";
