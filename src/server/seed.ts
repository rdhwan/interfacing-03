// const db = require("./db");
import db from "./db.js";

const range = 20.0;
const randomRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const seed = async () => {
  // seed random data from 1 january 2024 to now per hour
  const now = new Date();
  const start = new Date("2024-01-01T00:00:00");

  const diff = now.getTime() - start.getTime();
  const days = diff / (1000 * 60 * 60 * 24);

  for (let i = 0; i < days; i++) {
    for (let j = 0; j < 24; j++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      date.setHours(j);

      const sensorA = randomRange(range - 5, range + 5);
      const sensorB = randomRange(range - 5, range + 5);
      const sensorC = randomRange(range - 5, range + 5);
      const sensorAVG = (sensorA + sensorB + sensorC) / 3;
      //   const controller = randomRange(range - 5, range + 5);

      // randomize controller value like PID controller, the controller value will be the average of the sensor value
      const controller =
        sensorAVG > range
          ? randomRange(range - 5, range)
          : randomRange(range, range + 5);

      await db.temperature.create({
        data: {
          sensorA,
          sensorB,
          sensorC,
          sensorAVG,
          controller,
          timestamp: date,
        },
      });
    }
  }
};

seed();
