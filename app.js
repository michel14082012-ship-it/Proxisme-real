const express = require('express');
const http = require('http');

const {
  createBareServer
} = require('@tomphttp/bare-server-node');

const {
  uvPath
} = require('@titaniumnetwork-dev/ultraviolet');

const app = express();

const server = http.createServer(app);

const bare =
  createBareServer('/bare/');

/* =========================
   STATIC
========================= */

app.use(
  '/uv/',
  express.static(uvPath)
);

app.use(
  express.static('./public')
);

/* =========================
   HOME
========================= */

app.get('/', (req, res) => {

  res.sendFile(
    __dirname + '/public/index.html'
  );

});

/* =========================
   REQUEST
========================= */

server.on(
  'request',

  (req, res) => {

    if (bare.shouldRoute(req)) {

      bare.routeRequest(req, res);

    } else {

      app(req, res);

    }

  }
);

/* =========================
   WEBSOCKET
========================= */

server.on(
  'upgrade',

  (req, socket, head) => {

    if (bare.shouldRoute(req)) {

      bare.routeUpgrade(
        req,
        socket,
        head
      );

    } else {

      socket.end();

    }

  }
);

/* =========================
   START
========================= */

const PORT =
  process.env.PORT || 3000;

server.listen(PORT, () => {

  console.log(`

================================

 ULTRAVIOLET REAL

 PORT ${PORT}

================================

  `);

});
