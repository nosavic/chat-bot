// src/utils/api.ts
import axios, { AxiosError } from "axios";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface PaymentResponse {
  authorization_url: string;
  reference: string;
}

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

export const sendChatMessage = async (
  sessionId: string,
  input: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await API.post("/chat", { sessionId, input });
    return { data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      error:
        (axiosError.response?.data as { error?: string })?.error?.toString() ||
        "Connection failed",
    };
  }
};

export const initiatePayment = async (
  sessionId: string,
  amount: number
): Promise<ApiResponse<PaymentResponse>> => {
  try {
    const response = await API.post("/payment/initialize", {
      sessionId,
      amount,
    });
    return { data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      error:
        (axiosError.response?.data as { error?: string })?.error?.toString() ||
        "Payment failed",
    };
  }
};

// import axios from "axios";
// const API = axios.create({ baseURL: "http://localhost:5000/api" });

// export const sendChatMessage = async (sessionId: string, message: string) => {
//   const res = await API.post("/chat", { sessionId, message });
//   return res.data;
// };
