const fs = require('fs');
const path = require('path');

// File path to the tempOrders.json
const TEMP_ORDERS_FILE = path.join(__dirname, './data/tempOrders.json');

// ✅ Load all temp orders
const loadTempOrders = () => {
  if (!fs.existsSync(TEMP_ORDERS_FILE)) return [];
  const raw = fs.readFileSync(TEMP_ORDERS_FILE);
  return JSON.parse(raw);
};

// ✅ Save all orders to file
const saveTempOrders = (orders) => {
  fs.writeFileSync(TEMP_ORDERS_FILE, JSON.stringify(orders, null, 2));
};

// ✅ Add new temp order
const addOrder = (order) => {
  const orders = loadTempOrders();
  const newOrder = {
    ...order,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(), // Expires in 12 hrs
  };
  orders.push(newOrder);
  saveTempOrders(orders);
  return newOrder;
};

// ✅ Get all temp orders (optionally filter by hotel or user)
const getOrders = (filterFn = null) => {
  const orders = loadTempOrders();
  return filterFn ? orders.filter(filterFn) : orders;
};

// ✅ Remove a temp order by ID
const removeOrder = (orderId) => {
  let orders = loadTempOrders();
  orders = orders.filter(order => order.id !== orderId);
  saveTempOrders(orders);
  return orders;
};

// ✅ Update an existing order
const updateOrder = (orderId, updatedData) => {
  let orders = loadTempOrders();
  let found = false;

  orders = orders.map(order => {
    if (order.id === orderId) {
      found = true;
      return { ...order, ...updatedData };
    }
    return order;
  });

  if (found) {
    saveTempOrders(orders);
    return orders.find(order => order.id === orderId);
  } else {
    return null;
  }
};

// ✅ Clear all expired orders
const cleanExpiredOrders = () => {
  const now = new Date();
  let orders = loadTempOrders();
  orders = orders.filter(order => new Date(order.expiresAt) > now);
  saveTempOrders(orders);
  return orders;
};

// ✅ Add item to an existing order
const addItemToOrder = (orderId, item) => {
  let orders = loadTempOrders();
  let orderToUpdate = orders.find(order => order.id === orderId);

  if (orderToUpdate) {
    if (!orderToUpdate.items) {
      orderToUpdate.items = [];
    }
    const newItem = { ...item, status: 'new' }; // Default status 'new'
    orderToUpdate.items.push(newItem);
    saveTempOrders(orders);
    return newItem;
  } else {
    return null; // Order not found
  }
};

// ✅ Update status of an item in an order
const updateItemStatusInOrder = (orderId, itemId, status) => {
  let orders = loadTempOrders();
  let orderToUpdate = orders.find(order => order.id === orderId);

  if (orderToUpdate && orderToUpdate.items) {
    const itemToUpdate = orderToUpdate.items.find(item => item.id === itemId);
    if (itemToUpdate) {
      itemToUpdate.status = status; // e.g., 'delivered'
      saveTempOrders(orders);
      return itemToUpdate;
    }
  }
  return null; // Order or item not found
};



// ✅ Export functions
module.exports = {
  addOrder, addItemToOrder,
  updateItemStatusInOrder,
  getOrders,
  removeOrder,
  updateOrder,
  cleanExpiredOrders,
};

