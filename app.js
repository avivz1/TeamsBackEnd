var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
// const jwt = require('jsonwebtoken');


var usersRouter = require('./Routers/UsersRouter');
var LoginRouter = require('./Routers/LoginRouter');
var StudentsRouter = require('./Routers/StudentsRouter');
var TeamsRouter = require('./Routers/TeamsRouter');
var PracticeRouter = require('./Routers/PracticeRouter');

var app = express();

app.use((req, res, next) => {
    // check if the request is the login endpoint
    if (req.path === '/login/signup' || req.path == '/login') {
        return next(); // skip middleware for login endpoint
    }
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];

            jwt.verify(token, 'mysecret', (err, user) => {
                if (err) {
                    return res.sendStatus(403);
                }
                req.user = user;

                next();
            });
        
    } else {
        res.sendStatus(401);
    }
});









let db = require('./Config/dataBase');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(expressJwt({
//     secret: 'your-secret-key',
//     algorithms: ['HS256']
//   }).unless({path: ['/login']}));

app.use('/users', usersRouter);
app.use('/login', LoginRouter);
app.use('/students', StudentsRouter);
app.use('/teams', TeamsRouter);
app.use('/practices', PracticeRouter);

module.exports = app;
