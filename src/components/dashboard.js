import React, { useMemo } from "react";
import { Layout, Button, Table, Empty, Card } from "antd";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  TimeScale, // Import TimeScale
} from "chart.js";
import "chartjs-adapter-date-fns"; // Date adapter for time scale

import { TiArrowSortedUp } from "react-icons/ti";
import { TiArrowSortedDown } from "react-icons/ti";
import HeaderComp from "./header";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  TimeScale // Register TimeScale
);
// Your existing options and COLUMN configuration code...

const { Header, Content } = Layout;

function status_change_percentage(value) {
  if (value > 0) {
    return (
      <div className="flex items-center gap-1">
        <TiArrowSortedUp className="text-green-600" />
        <p className="text-green-600">{value?.toFixed(2) ?? 0} %</p>
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-1">
        <TiArrowSortedDown className="text-red-600" />
        <p className="text-red-600">{value?.toFixed(2) ?? 0} %</p>
      </div>
    );
  }
}

const Dashboard = ({ currencyDetails, detailsData, flactuatedPrice }) => {
  // Sample data for charts
  const doughnutData = {
    labels: ["Total Volume", "Market Cap", "24h Change"],
    datasets: [
      {
        label: "Total Volume",
        data: [400, 50, 100],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 2,
      },
    ],
  };

  const marketCap = useMemo(() => {
    return currencyDetails.data.map((item) => {
      return {
        market_cap: item.market_cap,
        last_updated: item.last_updated,
      };
    });
  }, [currencyDetails.data]);

  const chartData = {
    datasets: [
      {
        label: "Market Cap",
        data: marketCap.map((data) => ({
          x: new Date(data.last_updated), // Set x as Date object for time scale
          y: `${data.market_cap / 10000000000}`,
        })),
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return null;
          }
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top
          );
          gradient.addColorStop(0, "rgba(75,192,192,0)");
          gradient.addColorStop(1, "rgba(75,192,192,0.4)");
          return gradient;
        },
        borderColor: "rgba(75,192,192,1)",
        pointRadius: 0, // Removes point markers
        borderWidth: 2,
        tension: 0.4, // Smooth curve
        fill: true, // Enables gradient fill
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "MMM dd, yyyy",
          displayFormats: {
            day: "MMM dd yyyy",
          },
        },
        title: {
          display: true,
          text: "Date",
          color: "#666",
          font: {
            family: "Arial",
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          display: false, // Remove vertical grid lines
        },
      },
      y: {
        title: {
          display: true,
          text: "Market Cap",
          color: "#666",
          font: {
            family: "Arial",
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          color: "rgba(200, 200, 200, 0.3)", // Light horizontal grid lines
          lineWidth: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#333",
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
  };

  const chartDataArea = {
    labels: flactuatedPrice
      .slice(0, 10)
      .map((item) => new Date(item.time).toLocaleTimeString()),
    datasets: [
      {
        label: "Low Price (24h)",
        data: flactuatedPrice.slice(0, 10).map((item) => item.low_24h),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: (context) => {
          const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(75, 192, 192, 0.4)");
          gradient.addColorStop(1, "rgba(75, 192, 192, 0.1)");
          return gradient;
        },
        fill: true,
        tension: 0.3, // Curve the line slightly for smoothness
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
      },
      {
        label: "High Price (24h)",
        data: flactuatedPrice.slice(0, 10).map((item) => item.high_24h),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: (context) => {
          const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(255, 99, 132, 0.4)");
          gradient.addColorStop(1, "rgba(255, 99, 132, 0.1)");
          return gradient;
        },
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };

  const chartOptionsArea = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#333",
          font: { size: 12 },
        },
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0,0,0,0.7)", // Semi-transparent black tooltip
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 12 },
        borderColor: "rgba(0,0,0,0.2)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { display: false },
        title: {
          display: true,
          text: "Time",
          color: "#666",
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(200, 200, 200, 0.3)" }, // Subtle grid lines for y-axis
        title: {
          display: true,
          text: "Price",
          color: "#666",
        },
      },
    },
  };

  const COLUMN = [
    {
      title: "Coin",
      dataIndex: "image",
      key: "image",
    },
    {
      title: "Price",
      dataIndex: "current_price",
      key: "current_price",
      sorter: (a, b) => a.current_price.localeCompare(b.current_price),
    },
    {
      title: "1h",
      dataIndex: "one_hour",
      key: "one_hour",
      // sorter: (a, b) => {
      //   let first = parseInt(
      //     a?.one_hour?.props.children[1]?.props?.children[0]
      //   );
      //   let second = parseInt(
      //     b?.one_hour.props?.children[1]?.props?.children[0]
      //   );
      //   console.log(typeof first, typeof second);
      //   return first.localeCompare(second);
      // },
    },
    {
      title: "24h",
      dataIndex: "24_hour",
      key: "24_hour",
    },
    {
      title: "7d",
      dataIndex: "7_day",
      key: "7_day",
    },
    {
      title: "Updated Time",
      dataIndex: "last_updated",
      key: "last_updated",
    },
    {
      title: "Market Cap",
      dataIndex: "market_cap",
      key: "market_cap",
      sorter: (a, b) => a.market_cap.localeCompare(b.market_cap),
    },
    {
      title: "Total Volume",
      dataIndex: "total_volume",
      key: "total_volume",
      sorter: (a, b) => a.total_volume.localeCompare(b.total_volume),
    },
    {
      title: "Market Cap Change (24h) (%)",
      dataIndex: "market_cap_change_percentage_24h",
      key: "market_cap_change_percentage_24h",
      sorter: (a, b) => {
        let first =
          a?.market_cap_change_percentage_24h?.props.children[1]?.props
            .children[0] ?? 0;
        let second =
          b?.market_cap_change_percentage_24h?.props.children[1]?.props
            .children[0] ?? 0;

        return first.localeCompare(second);
      },
    },
  ];

  const structureData = (data) => {
    return data?.map((item) => {
      return {
        image: (
          <div className="flex items-center  gap-2">
            <img
              src={item?.image}
              alt={item?.name}
              width="30px"
              height="30px"
            />
            <p className="text-[17px]">{item?.name}</p>
          </div>
        ),
        current_price: "$" + " " + item?.current_price,
        one_hour: status_change_percentage(
          Object.keys(detailsData).length > 0
            ? detailsData?.price_change_percentage_1h_in_currency[item?.symbol]
            : 0
        ),
        "24_hour": status_change_percentage(
          Object.keys(detailsData).length > 0
            ? detailsData?.price_change_percentage_24h_in_currency[item?.symbol]
            : 0
        ),
        "7_day": status_change_percentage(
          Object.keys(detailsData).length > 0
            ? detailsData?.price_change_percentage_7d_in_currency[item?.symbol]
            : 0
        ),
        last_updated: new Date(item?.last_updated)?.toLocaleString(),
        market_cap: "$" + " " + item?.market_cap,
        total_volume: "$" + " " + item?.total_volume,
        market_cap_change_percentage_24h: status_change_percentage(
          item?.market_cap_change_percentage_24h
        ),
      };
    });
  };

  return (
    <Layout className="min-h-screen">
      <HeaderComp />
      {currencyDetails?.data && currencyDetails?.data?.length > 0 ? (
        <Content className="p-4 bg-gray-100">
          <div className="flex  gap-4 mb-4">
            <div className="w-full md:w-1/3 h-[300px] bg-white p-4 rounded shadow">
              <h2 className="text-center font-semibold mb-2">Doughnut Chart</h2>
              <div className="w-full h-60 flex justify-center ">
                <Doughnut data={doughnutData} />
              </div>
            </div>
            <div className="w-full md:w-1/3 bg-white p-4 rounded shadow">
              <h2 className="text-center font-semibold mb-2">Market Cap</h2>
              <div className="h-60">
                <Line
                  data={chartData}
                  options={chartOptions}
                  width={400}
                  height={""}
                />
              </div>
            </div>
            <div className="w-full md:w-1/3 bg-white p-4 rounded shadow">
              <h2 className="text-center font-semibold mb-2">
                Higher & Lower (24h)
              </h2>
              <div className="h-60">
                <Line
                  key="higher&lower"
                  data={chartDataArea}
                  options={chartOptionsArea}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <Table
              loading={currencyDetails.loading}
              columns={COLUMN}
              dataSource={structureData(currencyDetails?.data)}
              pagination={{ pageSize: 5 }}
              scroll={{ y: 270 }}
            />
          </div>
        </Content>
      ) : (
        <Card className="p-4 flex w-full h-[89vh] items-center justify-center ">
          <Empty />
        </Card>
      )}
    </Layout>
  );
};

export default Dashboard;
