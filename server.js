const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const connect_db = require('./utils/db');
const Pusher = require('pusher');
const mongoose = require('mongoose');

//app configs
const http = require("http").Server(app);

const io = require('socket.io')(http);

const pusher = new Pusher({
    appId: "1137134",
    key: "cf01180c00e11b4dd573",
    secret: "3344389cc47248256a59",
    cluster: "ap2",
    useTLS: true
});

//CORS
const whitelist = [
    "http://localhost:3000",
    "http://localhost:8080",
    "https://floating-crag-49021.herokuapp.com",
    "*"
  ];
  const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
};

// Middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan("combined"));
app.use(cors(corsOptions))

// Health check route
app.use('/health-check', (req, res) => {
    res.send("Healthy")
})

// API route files
const userRoute = require('./routes/user');
const messageRoute = require('./routes/message');
const chatroomRoute = require('./routes/chatroom');
const Message = require('./models/Message');

// APIs Routes
const url = '/api/v1/';
app.use(url, userRoute);
app.use(url, messageRoute);
app.use(url, chatroomRoute);

// Connect DB
connect_db();

const db = mongoose.connection;

db.once("open", () => {
    const messageCollection = db.collection("messages");
    const changeStream = messageCollection.watch();

    changeStream.on("change", (change) => {
        if (change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted', 
            {
                user: messageDetails.user,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                receiver: messageDetails.receiver,
                read: messageDetails.read
            })
        } else {
            console.log('Pusher error')
        }
    })

})

io.on('connection', (socket) => {

  console.log('new connection established')

  socket.on('join', (name, chatroom) => {
      socket.join(chatroom)

      socket.emit('message', generateMessage('Admin', 'Welcome!'))
      socket.broadcast.to(chatroom).emit('message', generateMessage('Admin', `${name} has joined!`))
      io.to(chatroom).emit('roomData', {
          chatroom,
          name
      })

      callback()
  })

    // console.log("connected")
    // // Get the last 10 messages from the database.
    // Message.find().sort({createdAt: -1}).limit(10).exec((err, messages) => {
    //   if (err) return console.error(err);
  
    //   // Send the last messages to the user.
    //   socket.emit('init', messages);
    // });
  
    // // Listen to connected users for a new message.
    // socket.on('message', (msg) => {
    //   // Create a message with the content and the name of the user.
    //   const message = new Message({
    //     content: msg.content,
    //     name: msg.name,
    //   });
  
    //   // Save the message to the database.
    //   message.save((err) => {
    //     if (err) return console.error(err);
    //   });
  
    //   // Notify all other users about a new message.
    //   socket.broadcast.emit('push', msg);
    // });
  });

http.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on port ${process.env.PORT || 8080}`);
});
