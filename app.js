var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const jwt = require('jsonwebtoken');
// const expressJwt = require('express-jwt');
const secret = '78tghjsweaeojnvsr';

var usersRouter = require('./Routers/UsersRouter');
var LoginRouter = require('./Routers/LoginRouter');
var StudentsRouter = require('./Routers/StudentsRouter');
var TeamsRouter = require('./Routers/TeamsRouter');
var PracticeRouter = require('./Routers/PracticeRouter');
var app = express();


let db = require('./Config/dataBase');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    // check if the request is the login endpoint
    if (req.path === '/login/signup' || req.path === '/login') {
        return next(); // skip middleware for login endpoint
    } else {

        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            jwt.verify(token, secret, (err, user) => {
                if (err) {
                    console.log('Authorization rejected')
                    // return res.sendStatus(403);
                    return res.status(403).json({
                        success: false,
                        message: 'Authorization rejected',
                        data: null
                    });
                }
                req.body.user = user;
                console.log('Authorization granted')
                next();
            });

        } else {
            // res.sendStatus(401);
            return res.status(401).json({
                success: false,
                message: 'No Token Found',
                data: null
            });
        }
    }

});


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
