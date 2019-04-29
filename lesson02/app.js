const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const config = require('config-lite')(__dirname)
const routes = require('./routes')
const pkg = require('./package')

const app = express()

app.set('views', path.join(__dirname, 'views')); // 设置存放的目录
app.set('view engine', 'ejs'); // 设置ejs为模板引擎
app.engine('html', require('ejs').renderFile); // 将ejs模板映射到html

// 设置静态目录
app.use(express.static(path.join(__dirname, 'public')))

// session 中间件
app.use(session({
  name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  resave: true, // 强制更新 session
  saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
  cookie: {
    maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
  },
  store: new MongoStore({// 将 session 存储到 mongodb
    url: config.mongodb// mongodb 地址
  })
}))

app.use(flash())
// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/img'), // 上传文件目录
  keepExtensions: true// 保留后缀
}))

app.use((req, res, next) => {
  console.log("Time: %d", Date.now());
  next();
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke');
})

app.locals.blog = {
  title: pkg.name,
  description: pkg.description
}

app.use((req, res, next) => {
  res.locals.user = req.session.user
  res.locals.success = req.flash('success').toString()
  res.locals.error = req.flash('error').toString()
  next()
})
routes(app);

app.listen(config.port, function () {
  console.log(`${pkg.name} listening on port ${config.port}`)
})

