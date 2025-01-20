const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;
const MONGODB_URL=process.env.MONGODB_URL;
const SESSION_SECRET=process.env.SESSION_SECRET;
app.use(bodyParser.json());

const cors=require("cors");
const corsOptions ={
   origin:process.env.CLIENT_URL, 
   credentials:true,       //access-control-allow-credentials:true
   methods: 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
   headers: ["content-type", "Access-Control-Allow-Methods", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials", "Access-Control-Allow-Headers", "Authorization"],
   preflightContinue: true,
   optionSuccessStatus:200
}

app.use(cors(corsOptions))
app.options('*', cors({origin:process.env.CLIENT_URL}))

mongoose.connect(MONGODB_URL)
.then(() => {
    console.log('Connected to mongoDB....');
})
.catch((error) => {
    console.log('Failed to connect to mongodb....');
})

app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

const authRoute = require('./routes/authRoute');  
app.use('/auth', authRoute);

const {authenticate} = require('./middleware/authMiddleware');

const userRoute = require('./routes/userRoute');
app.use('/users', authenticate, userRoute);

 const questionRoute = require('./routes/questionRoute');
 app.use('/questions',authenticate, questionRoute);

const answerRoute = require('./routes/answerRoute');
app.use('/answers',authenticate, answerRoute);

const commentRoute = require('./routes/commentRoute');
app.use('/comments',authenticate, commentRoute);


const server = app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}....`);
})

const io = socketIo(server, {
    cors: {
        origin: process.env.CLIENT_URL
    }
  });

const {socket} = require('./socket/socket');
socket(io);

