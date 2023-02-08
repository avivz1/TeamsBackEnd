var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

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

app.use('/users', usersRouter);
app.use('/login', LoginRouter);
app.use('/students', StudentsRouter);
app.use('/teams', TeamsRouter);
app.use('/practices', PracticeRouter);

module.exports = app;
