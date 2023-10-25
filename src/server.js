import express from 'express'

const app = express()
const port = 2504

app.get('/', function (req, res) {
    res.send('<h1>Xin chao</h1>')
  })
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })