-- AlterTable
ALTER TABLE "users" ADD COLUMN     "magicToken" TEXT,
ADD COLUMN     "magicTokenExpiry" TIMESTAMP(3),
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);
