-- CreateTable
CREATE TABLE "PhoneNumber" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhoneNumber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PhoneNumber_number_key" ON "PhoneNumber"("number");
