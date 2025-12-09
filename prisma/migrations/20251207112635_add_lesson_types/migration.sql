-- CreateEnum
CREATE TYPE "LessonType" AS ENUM ('VIDEO', 'TEXT', 'MATERILAS');

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "type" "LessonType" NOT NULL DEFAULT 'VIDEO';
