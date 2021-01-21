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

const io = require('socket.io')(http, {
  cors: {
    origin: "https://floating-crag-49021.herokuapp.com",
    methods: ["GET", "POST"]
  }
});

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
const { registerUser } = require('./controllers/UserController');
const Users = require('./models/Users');
const ChatRoom = require('./models/ChatRoom');

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
                read: messageDetails.read
            })
        } else {
            console.log('Pusher error')
        }
    })

})

io.on('connection', (socket) => {

  console.log('new connection established', socket.id)



  socket.on('join', (name) => {
    let rooms = io.sockets.adapter.rooms
    console.log("rooms", rooms)
    socket.join(name)
})

socket.on('message', (name) => {
  socket.to(name.chatroom).emit('sendMessage', {status: true})
})

// socket.on('receivedMessage', (chatroom) => {
//   socket.emit('')
// })

socket.on('onTyping', (name) => {
  if (name.text && name.text.length > 0)
    socket.to(name.chatroom).emit('typing', {username: name.name, status: true});
  else socket.to(name.chatroom).emit('typing', {username: name.name, status: false});
})

socket.on('markAsRead', (name) => {
  socket.to(name).emit('markAsSeen', message)
})

  socket.on('disconnect', () => {
    console.log('disconnected')
  })

});

http.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on port ${process.env.PORT || 8080}`);
});
