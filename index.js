const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const {  addOrder, addItemToOrder,
  updateItemStatusInOrder,
  getOrders,
  removeOrder,
  updateOrder,
  cleanExpiredOrders} = require('./server/order');
const { addTable,
  getTables,
  removeTable,
  updateTable,
  clearAllTables,
  updateTableStatus,
  getTableOrders,} = require('./server/table');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer);

io.on('connection', (socket) => {
    console.log(`User connected with socket ID: ${socket.id}`);

    socket.on('joinTable', (tableId, callback) => {
      const table = addTable({ id: tableId, socketId: socket.id });
      socket.join(tableId);
      console.log(`Socket ${socket.id} joined table: ${tableId}`);
      callback({ status: 'ok', table });
      io.emit('table_updated', getTables());
    });

    socket.on('placeOrder', (orderData, callback) => {
      const newOrder = addOrder(orderData);
      console.log(`Socket ${socket.id} placed order: ${JSON.stringify(newOrder)}`);
      io.emit('new_order', newOrder);
      callback({ status: 'ok', order: newOrder });
    });

    socket.on('addItemToOrder', (itemData, callback) => {
      const updatedOrder = addItemToOrder(itemData.orderId, itemData.item);
      console.log(`Socket ${socket.id} added item to order: ${JSON.stringify(updatedOrder)}`);
      io.emit('order_updated', updatedOrder);
      callback({ status: 'ok', order: updatedOrder });
    });

    socket.on('closeOrder', (orderId, callback) => {
      removeOrder(orderId);
      console.log(`Socket ${socket.id} closed order: ${orderId}`);
      io.emit('order_closed', orderId);
      callback({ status: 'ok' });
    });

    socket.on('update_order_status', ({ orderId, status }, callback) => {
      const updatedOrder = updateOrder(orderId, { status });
      console.log(`Socket ${socket.id} updated order ${orderId} to status: ${status}`);
      io.emit('order_updated', updatedOrder);
      callback({ status: 'ok', order: updatedOrder });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      const tables = getTables();
      const table = tables.find(t => t.socketId === socket.id);
      if (table) {
        removeTable(table.id);
        io.emit('table_updated', getTables());
      }
    });
  });

  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
