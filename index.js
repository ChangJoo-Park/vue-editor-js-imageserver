var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var multer = require('multer')
var fs = require('fs');
var axios = require('axios')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({ storage: storage })
var path = require('path')
var app = express()
var https = require('https')

app.use(cors())
app.use(bodyParser.json())

app.post('/image', upload.single('image'), function (req, res, next) {
  // req.file 은 `image` 라는 필드의 파일 정보입니다.
  // 텍스트 필드가 있는 경우, req.body가 이를 포함할 것입니다.
  if (req.file) {
    return res.json({
      success: 1,
      file: {
        url: `http://127.0.0.1:8090/image/${req.file.filename}`
      }
    })
  } else {
    return res.json({
      success: 0
    })
  }
})

app.post('/image-by-url', function (req, res, next) {
  const { url } = req.body
  const filename = (new Date()).toISOString() + '.jpg'
  const file = fs.createWriteStream(path.join(__dirname,'uploads', filename));
  https.get(url, function(response) {
    response.pipe(file);
    return res.json({
      success: 1,
      file: {
        url: `http://127.0.0.1:8090/image/${filename}`
      }
    })
  });
})

app.get('/image/:image', function (req, res, next) {
  console.log('called')
  const image_path = req.params['image']
  const image = path.join(__dirname, 'uploads', image_path)
  res.sendFile(image)
})

app.listen(8090, () => {
  console.log('listen on 8090')
})