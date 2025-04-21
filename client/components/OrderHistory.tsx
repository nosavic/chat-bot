import { FiClock, FiShoppingCart } from "react-icons/fi";

export default function OrderHistory({ orders }: any) {
  return (
    <div className="bg-white shadow-sm p-4 rounded-xl">
      <h3 className="flex items-center gap-2 mb-4 font-semibold text-lg">
        <FiClock className="w-5 h-5 text-blue-600" />
        Order History
      </h3>

      {orders.length === 0 ? (
        <div className="py-8 text-gray-500 text-center">
          <FiShoppingCart className="mx-auto mb-4 w-12 h-12" />
          <p>No past orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any, index: number) => (
            <div
              key={index}
              className="hover:bg-gray-50 p-4 border rounded-lg transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">Order #{index + 1}</h4>
                  <p className="text-gray-500 text-sm">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <span className="font-medium text-blue-600">
                  $
                  {order
                    .reduce((sum: number, item: any) => sum + item.price, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="text-gray-600 text-sm">
                {order.map((item: any) => item.name).join(", ")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
