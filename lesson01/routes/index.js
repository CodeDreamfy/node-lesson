const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'public/img' });
const superagent = require('superagent');
const accessToken = require('../config/getAccessToken');

router.get('/', (req, res) => {
  res.send('hello , express');
})
router.get('/demo', (req, res) => {
  res.render('demo.html')
})
router.post('/getText', upload.single('imgData'), (req, res) => {
  let imgBase64 =req.fields.imgData;
  imgBase64 = imgBase64.replace("data:image/png;base64,", '');
  imgBase64 = encodeURI(imgBase64);
  getImgResult(imgBase64).then((resp) => {
    console.log()
    res.send({
      status: 200,
      data: resp.body
    })
  }, (erro) => {
      res.send(erro.data)
  })
})

function getImgResult(data) {
  return superagent
    .post('https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic')
    .set({ 'Content-Type': 'application/x-www-form-urlencoded' })
    .send({
      'access_token': accessToken.access_token,
      'image': data
    })
}

module.exports = router;