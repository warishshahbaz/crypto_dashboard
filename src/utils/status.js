export const status = (status) => {
  status = Number(status);

  if (status > 0) {
    console.log(status);
    return <p className="text-green-600">{status}</p>;
  } else {
    return <p className="text-red-600">{status}</p>;
  }
};
