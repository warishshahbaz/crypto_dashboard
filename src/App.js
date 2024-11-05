import React, { useEffect, useState } from "react";
import Dashboard from "./components/dashboard";
import axios from "axios";

const URL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false`;

const ALL_URL = `https://api.coingecko.com/api/v3/coins/bitcoin`;

const API_KEY = `6FD85708-DA0E-443E-859B-4090A79D6210`;

const App = () => {
  const [currencyDetails, setCurrencyDetails] = useState({
    loading: false,
    data: [],
    error: "",
  });
  const [detailsData, setDetailsData] = useState({});
  const [flactuatedPrice, setFlactuatedPrice] = useState([]);

  const fetchCurrency = async () => {
    setCurrencyDetails((prev) => ({ ...prev, loading: true }));
    try {
      let response = await axios(URL);
      setCurrencyDetails((prev) => ({
        ...prev,
        data: response.data,
        loading: false,
      }));
      if (response.status === 200) {
        let res = response?.data?.map((item) => {
          return {
            time: item.last_updated,
            low_24h: item.low_24h,
            high_24h: item.high_24h,
          };
        });
        setFlactuatedPrice(res ?? []);
      }
    } catch (error) {
      setCurrencyDetails((prev) => ({
        ...prev,
        error: error.message,
        loading: false,
      }));
    }
  };
  const fetchDetails = async () => {
    try {
      let response = await axios(ALL_URL);

      let data = response?.data?.market_data;
      setDetailsData({
        price_change_percentage_1h_in_currency:
          data.price_change_percentage_1h_in_currency,
        price_change_percentage_7d_in_currency:
          data.price_change_percentage_7d_in_currency,
        price_change_percentage_24h_in_currency:
          data.price_change_percentage_24h_in_currency,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  console.log(detailsData);

  useEffect(() => {
    fetchCurrency();
    fetchDetails();
  }, []);
  return (
    <>
      <Dashboard
        currencyDetails={currencyDetails}
        detailsData={detailsData}
        flactuatedPrice={flactuatedPrice}
      />
    </>
  );
};

export default App;
