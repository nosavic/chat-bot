const Session = require("../models/Session");
const MenuItem = require("../models/MenuItem");
const Order = require("../models/Order");

// Function to handle chat input
// Function to handle chat input
// Function to handle chat input
// Function to handle chat input
// Function to handle chat input
exports.handleChatInput = async (req, res) => {
  const { sessionId, input } = req.body;

  try {
    // Retrieve or create a session
    let session = await Session.findOne({ sessionId }).populate("currentOrder");

    if (!session) {
      session = await Session.create({ sessionId });
    }

    switch (input) {
      case "1": // Place an order
        const menuItems = await MenuItem.find().lean(); // Use lean() for better performance

        // Format response with essential fields
        const formattedMenu = menuItems.map((item) => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          description: item.description,
          category: item.category,
          image: item.image,
          number: item.number,
        }));

        // Create a message with the menu and their corresponding numbers
        const menuMessage = formattedMenu
          .map((item) => {
            return `${item.number}. ${item.name} - ₦${item.price}`;
          })
          .join("\n");

        return res.json({
          response: `Select a number to place an order:\n${menuMessage}`,
        });

      case "97": // View current order
        if (!session.currentOrder) {
          return res.json({ response: "No current order" });
        }

        const currentOrder = await Order.findById(
          session.currentOrder
        ).populate("items.menuItem");

        if (!currentOrder) {
          return res.json({ response: "Current order not found." });
        }

        if (currentOrder.items.length === 0) {
          return res.json({ response: "Your order is empty." });
        }

        const itemsList = currentOrder.items
          .map(
            (item) =>
              `- ${item.menuItem.name} (x${item.quantity}) - ₦${
                item.menuItem.price * item.quantity
              }`
          )
          .join("\n");

        const currentOrderMessage = `
🛒 Your Current Order:
${itemsList}

💰 Total: ₦${currentOrder.total}
📦 Status: ${currentOrder.status}
💳 Payment: ${currentOrder.paymentStatus}
📅 Created: ${new Date(currentOrder.createdAt).toLocaleDateString()}
`.trim();

        return res.json({ response: currentOrderMessage });

      case "98": // View order history
        const history = await Order.find({
          _id: { $in: session.orderHistory },
        }).populate("items.menuItem");

        if (!history.length) {
          return res.json({ response: "No order history found." });
        }

        const formattedHistory = history.map((order, index) => {
          const items = order.items
            .map(
              (item) =>
                `- ${item.menuItem.name} (x${item.quantity}) - ₦${item.menuItem.price}`
            )
            .join("\n");

          return `
🧾 Order ${index + 1}
📅 Date: ${new Date(order.createdAt).toLocaleDateString()}
🛒 Items:
${items}

💰 Total: ₦${order.total}
📦 Status: ${order.status}
💳 Payment: ${order.paymentStatus}
`.trim();
        });

        return res.json({ response: formattedHistory.join("\n\n") });

      case "99": // Checkout order
        if (!session.currentOrder) {
          return res.json({ response: "No order to place" });
        }

        const lastOrder = await Order.findById(session.currentOrder);
        lastOrder.status = "completed";
        await lastOrder.save();

        session.orderHistory.push(session.currentOrder);
        session.currentOrder = null;
        await session.save();

        return res.json({ response: "Order placed successfully" });

      case "0": // Cancel order
        if (session.currentOrder) {
          await Order.findByIdAndDelete(session.currentOrder);
          session.currentOrder = null;
          await session.save();
        }
        return res.json({ response: "Order cancelled" });

      default:
        // Convert input to number
        const inputNumber = Number(input);

        // Only proceed if input is a valid number (and not 0 which is cancel)
        if (inputNumber >= 1) {
          const menuItem = await MenuItem.findOne({ number: inputNumber });

          console.log("Menu Item found:", menuItem); // For debugging

          if (!menuItem) {
            return res.status(404).json({
              error: "Item not found. Please select a valid item number.",
            });
          }

          let order = session.currentOrder
            ? await Order.findById(session.currentOrder)
            : new Order({ items: [], total: 0 });

          order.items.push({ menuItem: menuItem._id, quantity: 1 });
          order.total += menuItem.price;
          await order.save();

          if (!session.currentOrder) {
            session.currentOrder = order._id;
            await session.save();
          }

          return res.json({ response: `${menuItem.name} added to order` });
        }

        return res.status(400).json({ error: "Invalid input" });
    }
  } catch (err) {
    console.error("💥 ChatInput Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Initial welcome message
exports.getInitialMessage = (req, res) => {
  const welcomeMessage = `
Welcome to FoodieBot 🍽️!
Select an option:
1️⃣ Place an order  
9️⃣9️⃣ Checkout order  
9️⃣8️⃣ See order history  
9️⃣7️⃣ See current order  
0️⃣ Cancel order  
💳 After placing an order, you can also proceed to payment.
`;

  res.json({ response: welcomeMessage.trim() });
};
