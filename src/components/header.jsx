import React from "react";
import { Layout } from "antd";

const { Header, Content } = Layout;

const HeaderComp = () => {
  return (
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
  );
};

export default HeaderComp;
