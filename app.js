const express = require('express');
const path = require('path');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/api/posts');
const chatRoutes = require('./routes/chatRoutes');
const profileRoutes = require('./routes/api/profile')
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const isLoggedIn = require('./middleware');  
const flash = require('connect-flash');
const socketio = require('socket.io');
const http = require('http');

const app = express();

// chatting app
const server = http.createServer(app);
const io = socketio(server);
const Chat = require('./models/chat');

mongoose.connect('mongodb://localhost:27017/twitter_clone')
    .then(() => {
        console.log("db connected");
    }).catch((err) => {
        console.log(err);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
//flash
app.use(flash());

app.use(session({
    secret: "this is rochak's secret",
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
}));

//make use of my session for login/logout
app.use(passport.session());
//used for initializing the passport
app.use(passport.initialize());
//authenticating the user
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(authRoutes);
app.use(postRoutes);
app.use(profileRoutes);
app.use(chatRoutes);

app.get('/', isLoggedIn, (req, res) => {
        res.render('home');
});

// connection for socket
io.on('connection',(socket) => {
    console.log("connection estabilished");
    console.log(socket.id);

    socket.on("send-msg", async (data) => {
        const chatData = await Chat.create({content : data.msg, user : data.user});
        io.emit("received-msg", {
            msg : data.msg,
            user : data.user,
            createdAt : new Date()
        });
    })
});



server.listen(3000, () => {
    console.log('welcome to twitter clone');
});