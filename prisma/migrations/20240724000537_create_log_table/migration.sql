-- CreateTable
CREATE TABLE "log" (
    "id" TEXT NOT NULL,
    "payer" TEXT NOT NULL,
    "payee" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "log_pkey" PRIMARY KEY ("id")
);
