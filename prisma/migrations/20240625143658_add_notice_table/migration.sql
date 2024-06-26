-- CreateTable
CREATE TABLE "Notice" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Notice_id_key" ON "Notice"("id");
