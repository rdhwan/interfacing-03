import { Stack, Input, Heading, Select, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import useApi, {
  ResponseModel,
  useToastErrorHandler,
} from "../../../hooks/useApi";

type HistoryData = {
  sensorA: number;
  sensorB: number;
  sensorC: number;
  sensorAVG: number;
  controller: number;
  timestamp: string;
};

type Options = {
  period: "daily" | "monthly";
  from: string;
  to: string;
};

const HistoryPage = () => {
  const [data, setData] = useState<HistoryData[]>([]);
  const [options, setOptions] = useState<Options>({
    period: "daily",
    // from month ago
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    // to today
    to: new Date().toISOString().split("T")[0],
  });

  const api = useApi();
  const toastErrorHandler = useToastErrorHandler();

  useEffect(() => {
    const qs = new URLSearchParams();
    qs.append("from", options.from);
    qs.append("to", options.to);
    qs.append("period", options.period);

    api
      .get<ResponseModel<HistoryData[]>>("/data?" + qs.toString())
      .then((res) => {
        setData(res.data.data);
      })
      .catch(toastErrorHandler);
  }, [options]);

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
      data: data.map((d) => d.controller),
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
      max: 70,
      min: 0,
      decimalsInFloat: 2,
    },
    legend: {
      show: true,
    },
  };

  return (
    <Stack gap={"1rem"} textAlign={"justify"}>
      <Heading size={"lg"}>History</Heading>

      <Stack direction={"row"} w={"full"}>
        <Stack flex={1}>
          <Text>From</Text>
          <Input
            placeholder="Select Date and Time"
            size="md"
            type="date"
            value={options.from}
            onChange={(e) =>
              setOptions((prev) => ({ ...prev, from: e.target.value }))
            }
          />

          <Text>To</Text>
          <Input
            placeholder="Select Date and Time"
            size="md"
            type="date"
            value={options.to}
            onChange={(e) =>
              setOptions((prev) => ({ ...prev, to: e.target.value }))
            }
          />
        </Stack>

        <Stack flex={1}>
          <Text>Period</Text>
          <Select
            value={options.period}
            onChange={(e) =>
              setOptions((prev) => ({
                ...prev,
                period: e.target.value as "daily",
              }))
            }
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
          </Select>
        </Stack>
      </Stack>

      <ApexCharts series={series} options={seriesOptions} />
    </Stack>
  );
};

export default HistoryPage;
