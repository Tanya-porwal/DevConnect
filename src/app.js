const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Let's set up EJS as our view engine so we can render some nice templates!
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/pages'));

// Time to plug in our middlewares! These will help us handle JSON, cookies, CORS, and static files.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

// Pulling in our route handlers here
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');

// Let's mount our API routes so the frontend can talk to us
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// And here are the routes for serving our actual HTML/EJS pages to the user
app.get('/', (req, res) => res.render('index', { title: 'Home' }));
app.get('/login', (req, res) => res.render('login', { title: 'Login' }));
app.get('/register', (req, res) => res.render('register', { title: 'Register' }));
app.get('/dashboard', (req, res) => res.render('dashboard', { title: 'Dashboard' }));

// Oops! Catch-all route just in case someone gets lost and hits a 404
app.use((req, res) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

module.exports = app;

// app.get("/post", (req, res) => {
//   res.send("blog list ");
// });
// app.post("/post", (req, res) => {
//   res.send("POST request received" );
// });
// app.put("/post/:id", (req, res) => {
//   const postId = req.params.id;
//   res.send(`PUT request received for post with ID: ${postId}` );
// });

// function generateToken() {
//     let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

//     let token = "";
//     for (let i = 0; i < 32; i++) {
//         // use a simple function here
//         token += options[Math.floor(Math.random() * options.length)];
//     }
//     return token;
// }

// app.post("/signin", (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;

//     const user = users.find(user => user.username === username && user.password === password);

//     if (user) {
//         const token = generateToken();
//         user.token = token;
//         res.send({
//             token
//         })
//         console.log(users);
//     } else {
//         res.status(403).send({
//             message: "Invalid username or password"
//         })
//     }
// });
