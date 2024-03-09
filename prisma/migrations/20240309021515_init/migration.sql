-- CreateTable
CREATE TABLE "Temperature" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sensorA" REAL NOT NULL,
    "sensorB" REAL NOT NULL,
    "sensorC" REAL NOT NULL,
    "sensorAVG" REAL NOT NULL,
    "controller" REAL NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
