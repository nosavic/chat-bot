import { useState } from "react";
import { FiX, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";

export default function PaymentModal({
  isOpen,
  total,
  onClose,
  onSuccess,
}: any) {
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(onSuccess, 2000);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-2xl w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-xl">Complete Payment</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {!isSuccess ? (
          <>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="flex justify-between font-medium text-lg">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="p-3 border-2 border-gray-200 focus:border-blue-500 rounded-lg focus:outline-none w-full"
              />
            </div>

            <button
              onClick={handlePayment}
              disabled={!email || isProcessing}
              className="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 mt-6 py-3 rounded-lg w-full text-white transition-colors disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  Processing...
                  <div className="border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin"></div>
                </>
              ) : (
                "Pay with Paystack"
              )}
            </button>
          </>
        ) : (
          <div className="py-8 text-center">
            <FiCheckCircle className="mx-auto mb-4 w-16 h-16 text-green-500" />
            <h4 className="mb-2 font-semibold text-xl">Payment Successful!</h4>
            <p className="text-gray-600">Thank you for your order</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
