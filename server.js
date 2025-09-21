const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

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

    // Listen for a custom event from the client
    socket.on('place_order', (orderData) => {
      console.log(`New order received:`, orderData);
      
      // Broadcast the new order to all connected clients
      io.emit('new_order', {
        id: orderData.id,
        item: orderData.item,
        quantity: orderData.quantity,
        status: 'Pending',
        timestamp: new Date().toISOString(),
      });
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


