const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const session = require('express-session');
const cookieParser = require("cookie-parser");
const db = require("./models/prisma");

var path = require('path');
global.appRoot = path.resolve(__dirname);

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.json());

app.use(session({
    secret:'secretkey9910',
    saveUninitialized: true,
    resave: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24}
  }));

//Admin routes
app.use('/admin', require('./routes/adminRoutes'))
app.get('/', async (req, res) =>{
  let arrFiles = []
  // let page = 0
  // if(req.query.page && req.query.page.length > 0) {
  //   if(Number(req.query.page)) {
  //     page = Number(req.query.page)
  //   }
  // }
  if(req.query.filename && req.query.filename.length > 0) {
    
    const files =  await db.files.findMany({
      where: {
        OR: [
          {
            file1_name: {
              contains: req.query.filename,
              mode: 'insensitive'
            }
          },
          {
            file2_name: {
              contains: req.query.filename,
              mode: 'insensitive'
            }
          },
          {
            file3_name: {
              contains: req.query.filename,
              mode: 'insensitive'
            }
          }
        ]
      },
      orderBy: {
        createdAt: 'asc'
      }
    })
    arrFiles = files
  }else {
    arrFiles = await db.files.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    })
  }
  res.render("homepage", {files: arrFiles})
})
app.listen(PORT, console.log("Server don start for port: " + PORT))