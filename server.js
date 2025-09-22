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

// Create a Next.js app instance
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();


app.prepare().then(() => {
  // Create an HTTP server
  const httpServer = createServer((req, res) => {
    // Handle Next.js requests
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Attach Socket.IO to the HTTP server
  const io = new Server(httpServer);
  // Socket.IO event handling
  io.on('connection', (socket) => {
    console.log(`User connected with socket ID: ${socket.id}`);

   
    socket.on('joinTable', (tableId) => {
      // Logic for joining a table
      console.log(`Socket ${socket.id} joined table: ${tableId}`);
    });

    socket.on('placeOrder', (orderData) => {
      // Logic for placing an order
      console.log(`Socket ${socket.id} placed order: ${JSON.stringify(orderData)}`);
    });

    socket.on('addItemToOrder', (itemData) => {
      // Logic for adding item to order
      console.log(`Socket ${socket.id} added item to order: ${JSON.stringify(itemData)}`);
    });

    socket.on('closeOrder', (orderId) => {
      // Logic for closing an order
      console.log(`Socket ${socket.id} closed order: ${orderId}`);
    });



    // Handle client disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  // Start the server
  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});


