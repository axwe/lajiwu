const express = require('express')  // expres是一个函数
const history =  require('connect-history-api-fallback')
const multer = require('multer')
const cookieParser = require('cookie-parser')
const fs = require('fs')
const app = express(); // 得到一个对象

//获取当前时间 年_月_日
function getDate() {
  let uploadDate = new Date()
  let year = uploadDate.getFullYear()
  let month = uploadDate.getMonth() + 1
  if(month < 10) {
    month = '0'+month
  }
  let date = uploadDate.getDate()
  if(date < 10) {
    date = '0'+date
  }
  return year+'_'+month+'_'+date
}

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let newFiles = getDate()//获取当前日期
    //检索当前日期文件夹是否存在
    fs.exists(__dirname+'/uploads/'+newFiles, (exists) => {
      if(exists) {
        return
      }else {
        fs.mkdir(__dirname+'/uploads/'+newFiles, (err) => {
          if(err) {
            throw err
          }
        })
      }
    })
    cb(null, __dirname+'/uploads/'+newFiles); // 设置存储的位置
  },
  filename: (req, file, cb) => {
    let userId = req.cookies.userId
    cb(null, userId+'a'+parseInt(Math.random()*1000)+'.png'); // 文件的名字
  },
  fileFilter: (req, file, cb) => {
    if(file.memitype.slice(0,5) === 'image') {
      cb(null, true)
    }else {
      cb(null, false)
    }
  }
})
var upload = multer({ storage });

app.use(cookieParser());
// 设置静态文件的目录
app.use(express.static('dist'));
app.use(express.static('uploads'));
//访问任何子域都跳转首页
app.use(history({ 
  rewrites: [
    { from: /./, to: '/'}
  ]
}))

//首页
app.get('/', (req, res) => {
  res.sendFile(__dirname+'/view/index.html')
})

//图片上传
app.post('/api/upload', upload.single('miaov'), (req, res) => {
  res.send(req.file.destination.match(/(\d){4}_(\d){2}_(\d){2}/)[0] +'/'+ req.file.filename)
})

app.listen(8088, () => {
  console.log(1)
})
