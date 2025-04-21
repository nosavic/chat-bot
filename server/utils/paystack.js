const axios = require("axios");
dotenv = require("dotenv").config();

const instance = axios.create({
  baseURL: "https://api.paystack.co",
  headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` },
});

exports.initialize = async ({ amount, metadata }) => {
  const { data } = await instance.post("/transaction/initialize", {
    amount,
    metadata,
    callback_url: `${process.env.BASE_URL}/api/payment/callback`,
  });
  return data.data;
};

exports.verify = async (reference) => {
  const { data } = await instance.get(`/transaction/verify/${reference}`);
  return data.data;
};
