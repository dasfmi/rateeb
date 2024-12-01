import { Chart, ChartTypeRegistry, registerables } from "chart.js";

import { useEffect, useRef, useState } from "react";
import { Spinner } from "@radix-ui/themes";
import { Block, type ChartBlockViewer } from "@/entity";

type Props = {
  block: ChartBlockViewer;
};

export default function ChartBlock({ block }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>();
  const [database, setDatabase] = useState<Block | null>(null);

  // load data
  useEffect(() => {
    Chart.register(...registerables);
    // load target database
    fetch("http://localhost:4000/api/blocks/" + block.properties.databaseId)
      .then((resp) => resp.json())
      .then((resp) => setDatabase(resp.data));
  }, []);

  const renderChart = () => {
    if (!canvasRef.current || !database) return;
    console.log({ key: block.properties.query.key });

    // prepare data
    const keyCol = database.properties.columns.findIndex(
      (c) => c.label === block.properties.query.key
    );
    const valueCol = database.properties.columns.findIndex(
      (c) => c.label === block.properties.query.value
    );
    const data = {
      labels: [],
      datasets: [{ Label: block.properties.query.value, data: [] }],
    };
    database.blocks.forEach((row) => {
      data.labels.push(row[keyCol]);
      data.datasets[0].data.push(row[valueCol]);
    });

    chartRef.current = new Chart(canvasRef.current, {
      type: block.properties.chartType as keyof ChartTypeRegistry,
      data: data,
      options: {
        layout: {
          padding: 20,
        },
        plugins: {
          legend: {
            fullSize: false,
            position: "left",
          },
          title: {
            display: true,
            text: block.title,
          },
          subtitle: {
            display: true,
            text: block.description,
          },
        },
      },
      plugins: [],
    });

    // forwardRef(ref, chartRef.current);
  };

  const destroyChart = () => {
    // reforwardRef(ref, null);

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
  };

  useEffect(() => {
    renderChart();

    return () => destroyChart();
  }, [database]);

  return (
    <canvas ref={canvasRef} role="img" height={150} width={150}>
      <Spinner />
    </canvas>
  );
}
