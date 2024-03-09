import { Stack, Text, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";

import { baseWSUrl } from "../../hooks/useApi";

type RealtimeData = {
  sensorA: number;
  sensorB: number;
  sensorC: number;
  sensorAVG: number;
  control: number;
  timestamp: string;
};

const Index = () => {
  const [data, setData] = useState<RealtimeData[]>([]);

  useEffect(() => {
    const ws = new WebSocket(`${baseWSUrl}/realtime`);
    ws.onopen = () => {
      console.log("connected");
    };

    ws.onmessage = (event) => {
      try {
        const res = JSON.parse(event.data);

        // limit the data to 10
        if (data.length > 10) {
          setData((prev) => {
            // AC.exec("realtime", "updateSeries", [{ data: data }]);
            return [...prev.slice(1), res];
          });
        }

        setData((prev) => {
          // AC.exec("realtime", "updateSeries", [{ data: data }]);
          return [...prev, res];
        });
      } catch (err) {
        console.error(err);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const series = [
    {
      name: "sensorA",
      data: data.map((d) => d.sensorA),
    },
    {
      name: "sensorB",
      data: data.map((d) => d.sensorB),
    },
    {
      name: "sensorC",
      data: data.map((d) => d.sensorC),
    },
    {
      name: "sensorAVG",
      data: data.map((d) => d.sensorAVG),
    },
    {
      name: "control",
      data: data.map((d) => d.control),
    },
  ];

  const seriesOptions: ApexCharts.ApexOptions = {
    chart: {
      id: "realtime",
      height: 350,
      type: "line",
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 500,
        },
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 0,
    },
    xaxis: {
      type: "datetime",
      categories: data.map((d) => d.timestamp),
    },
    yaxis: {
      max: 50,
      min: 0,
      decimalsInFloat: 2,
    },
    legend: {
      show: true,
    },
  };

  return (
    <Stack gap={"1rem"} textAlign={"justify"}>
      <Heading size={"lg"}>Realtime</Heading>

      <ApexCharts series={series} options={seriesOptions} />
    </Stack>
  );
};

export default Index;
