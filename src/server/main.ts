import express, { Request, Response } from "express";
import ViteExpress from "vite-express";
import ExpressWs from "express-ws";
import { SerialPort, ReadlineParser } from "serialport";
import db from "./db.js";
import "dotenv/config";

import { type QSParams, qsParams } from "./schema/params.js";

const app = express();
const expressWs = ExpressWs(app);

const serialPort = new SerialPort({
  path: process.env.SERIAL_PORT ?? "/dev/ttyACM0",
  baudRate: Number(process.env.SERIAL_BAUD_RATE ?? 115200),
});

const parser = serialPort.pipe(new ReadlineParser({ delimiter: "\n" }));

serialPort.on("open", () => {
  serialPort.flush();
  console.log(
    `[INFO]: Serial port is open on ${process.env.SERIAL_PORT} at ${process.env.SERIAL_BAUD_RATE} baudrate`
  );
});

parser.on("data", async (data) => {
  try {
    const flag = data.split("#")[0];
    const value = data.split("#")[1].split(",");

    if (flag === "LOG") {
      const [sensorA, sensorB, sensorC, sensorAVG, controller] = value;

      await db.temperature.create({
        data: {
          sensorA: Number(sensorA),
          sensorB: Number(sensorB),
          sensorC: Number(sensorC),
          sensorAVG: Number(sensorAVG),
          controller: Number(controller),
        },
      });

      console.log(
        `[INFO]: New data logged - Sensor A: ${sensorA}, Sensor B: ${sensorB}, Sensor C: ${sensorC}, Sensor AVG: ${sensorAVG}, controller: ${controller}`
      );
    }
  } catch (err) {
    console.error(err);
  }
});

// express handler

app.get("/api", (_req, res) => {
  res.status(200).json({
    message: "Hello, world!",
  });
});

app.get("/api/data", async (req: Request<{}, {}, {}, QSParams>, res) => {
  const validation = await qsParams.safeParseAsync(req.query);

  if (!validation.success) {
    return res.status(400).json({ message: "Invalid query parameters" });
  }

  if (
    validation.data.period &&
    (!validation.data.from || !validation.data.to)
  ) {
    return res.status(400).json({ message: "Invalid query parameters" });
  }

  try {
    if (validation.data.period === "monthly") {
      // select average value of each sensor and controller per month
      const data = await db.$queryRaw`
        SELECT
            DATE_FORMAT(timestamp, '%Y-%m') AS timestamp,
            AVG(sensorA) AS sensorA,
            AVG(sensorB) AS sensorB,
            AVG(sensorC) AS sensorC,
            AVG(sensorAVG) AS sensorAVG,
            AVG(controller) AS controller
        FROM temperature
        WHERE timestamp >= ${validation.data.from} AND timestamp <= ${validation.data.to}
        GROUP BY DATE_FORMAT(timestamp, '%Y-%m');
      `;

      return res.status(200).json({
        message: "Data fetched successfully",
        data,
      });
    }

    if (validation.data.period === "daily") {
      const data = await db.$queryRaw`
        SELECT
          DATE_FORMAT(timestamp, '%Y-%m-%d') AS timestamp,
          AVG(sensorA) AS sensorA,
          AVG(sensorB) AS sensorB,
          AVG(sensorC) AS sensorC,
          AVG(sensorAVG) AS sensorAVG,
          AVG(controller) AS controller
        FROM temperature
        WHERE timestamp >= ${validation.data.from} AND timestamp <= ${validation.data.to}
        GROUP BY DATE_FORMAT(timestamp, '%Y-%m-%d');
      `;

      return res.status(200).json({
        message: "Data fetched successfully",
        data,
      });
    }

    if (validation.data.period === "hourly") {
      const data = await db.$queryRaw`
        SELECT
          DATE_FORMAT(timestamp, '%Y-%m-%d %H') AS timestamp,
          AVG(sensorA) AS sensorA,
          AVG(sensorB) AS sensorB,
          AVG(sensorC) AS sensorC,
          AVG(sensorAVG) AS sensorAVG,
          AVG(controller) AS controller
        FROM temperature
        WHERE timestamp >= ${validation.data.from} AND timestamp <= ${validation.data.to}
        GROUP BY DATE_FORMAT(timestamp, '%Y-%m-%d %H');
      `;

      // @ts-ignore
      const formattedTimestamp = data.map((d) => {
        return {
          ...d,
          timestamp: d.timestamp + ":00:00",
        };
      });

      return res.status(200).json({
        message: "Data fetched successfully",
        data: formattedTimestamp,
      });
    }

    const data = await db.temperature.findMany({
      where: {
        timestamp: {
          gte: validation.data.from,
          lte: validation.data.to,
        },
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    return res.status(200).json({
      message: "Data fetched successfully",
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// websocket for real-time data
expressWs.app.ws("/api/realtime", (ws, _req) => {
  try {
    const cb = (data: string) => {
      console.log("[INFO]: Real-time data received", data);

      const flag = data.split("#")[0];
      const value = data.split("#")[1].split(",");

      // send real-time data to the client
      if (flag === "RT") {
        ws.send(
          JSON.stringify({
            sensorA: Number(value[0]),
            sensorB: Number(value[1]),
            sensorC: Number(value[2]),
            sensorAVG: Number(value[3]),
            control: Number(value[4]),
            timestamp: new Date().toISOString(),
          })
        );
      }
    };

    parser.on("data", cb);

    ws.on("close", () => {
      parser.off("data", cb);
    });
  } catch (err) {
    console.error(err);
    ws.close();
  }
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
