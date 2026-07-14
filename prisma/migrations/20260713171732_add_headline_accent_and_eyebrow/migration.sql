/*
  Warnings:

  - Added the required column `eyebrow` to the `BirthdayContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `headlineAccent` to the `BirthdayContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `headlineAccent` to the `PremiumExperienceContent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BirthdayContent" ADD COLUMN     "eyebrow" TEXT NOT NULL,
ADD COLUMN     "headlineAccent" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PremiumExperienceContent" ADD COLUMN     "headlineAccent" TEXT NOT NULL;
