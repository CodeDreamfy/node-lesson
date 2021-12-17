const express = require('express');
var bodyParser = require('body-parser');
const formidableMiddleware = require('express-formidable');
const path = require('path');
const app = express();
const indexRouter = require('./routes');
const userRouter = require('./routes/user');

app.set('views', path.join(__dirname, 'views')); // 设置存放的目录
app.set('view engine', 'ejs'); // 设置ejs为模板引擎
app.engine('html', require('ejs').renderFile); // 将ejs模板映射到html

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(formidableMiddleware({
  uploadDir: path.join(__dirname, 'public/img'),
  keepExtensions: true
}));

app.use((req, res, next) => {
  console.log("Time: %d", Date.now());
  next();
})
app.use('/', indexRouter);
app.use('/users', userRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke');
})


app.listen(3000, function () {
  console.log("service running on port 3000 ")
})

console.log('hhhaaaa222')