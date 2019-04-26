const express = require('express');
const router = express.Router();
var multer = require('multer')
var upload = multer()
const axios = require('axios');

router.get('/', (req, res) => {
  res.send('hello , express');
})
router.get('/demo', (req, res) => {
  res.render('demo.html')
})
router.post('/getText', upload.array(), (req, res) => {
  console.log('Request', req.body);
  res.send({ status: 200, data: req.body })
})


module.exports = router;