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
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        label: "My First Dataset",
        data: [300, 50, 100],
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
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time", // Set x-axis as time scale
        time: {
          unit: "day", // Adjust based on your data (e.g., "month", "week")
          tooltipFormat: "MMM dd, yyyy", // Format for tooltip
          displayFormats: {
            day: "MMM dd yyyy h:mm a", // Format for x-axis labels
          },
        },
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Market Cap",
        },
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
        borderColor: "rgba(75, 192, 192, 1)", // Line color
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Area fill color
        fill: true, // Enable area under the line
      },
      {
        label: "High Price (24h)",
        data: flactuatedPrice.slice(0, 10).map((item) => item.high_24h),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ],
  };

  const chartOptionsArea = {
    maintainAspectRatio: false,
    responsive: true,
    radius: 1,
    borderStyle: {
      width: "1px",
    },

    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: true, // Ensure tooltips are enabled
        mode: "index", // Show tooltips for all datasets at hovered x-axis point
        intersect: false, // Show tooltips even when hovering between points
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
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
      dataIndex: "1_hour",
      key: "1_hour",
      sorter: (a, b) =>
        detailsData.price_change_percentage_1h_in_currency[
          a.symbol
        ].localeCompare(
          detailsData.price_change_percentage_1h_in_currency[b.symbol]
        ),
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
      sorter: (a, b) =>
        a.market_cap_change_percentage_24h.localeCompare(
          b.market_cap_change_percentage_24h
        ),
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
        "1_hour": status_change_percentage(
          detailsData?.price_change_percentage_1h_in_currency[item?.symbol]
        ),
        "24_hour": status_change_percentage(
          detailsData?.price_change_percentage_24h_in_currency[item?.symbol]
        ),
        "7_day": status_change_percentage(
          detailsData?.price_change_percentage_7d_in_currency[item?.symbol]
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
      <Header className="bg-white shadow-md flex justify-between items-center px-4">
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <div>
          <img
            src={
              "https://img.freepik.com/free-vector/flat-design-crypto-mining-logo-template_23-2149409053.jpg?t=st=1730802295~exp=1730805895~hmac=601c6c4b1225b86cd4f8d1528294fd64d727ebd64d40b8a1d9e60820bd06c040&w=740"
            }
            className="w-20 h-20"
            alt="logo"
          />
        </div>
      </Header>
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
                <Line data={chartDataArea} options={chartOptionsArea} />
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
