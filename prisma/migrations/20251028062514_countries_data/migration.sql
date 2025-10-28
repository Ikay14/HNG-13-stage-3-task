-- CreateTable
CREATE TABLE "countries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "capital" TEXT,
    "region" TEXT,
    "population" INTEGER NOT NULL,
    "currency_code" TEXT,
    "exchange_rate" DOUBLE PRECISION,
    "estimated_gdp" DOUBLE PRECISION,
    "flag_url" TEXT,
    "last_refreshed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_status" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "last_refreshed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "countries_name_key" ON "countries"("name");

-- CreateIndex
CREATE INDEX "countries_region_idx" ON "countries"("region");

-- CreateIndex
CREATE INDEX "countries_currency_code_idx" ON "countries"("currency_code");
